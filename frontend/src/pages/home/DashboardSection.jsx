import React from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  MoreVertical, 
  ArrowRight, 
  Check, 
  Users, 
  GraduationCap, 
  Target, 
  Percent
} from 'lucide-react';

export default function DashboardSection({ onNavigate, onOpenDemoModal }) {
  const candidates = [
    {
      name: 'Priya Sharma',
      status: 'TRAINING',
      statusColor: 'bg-[#FF408A] text-[#FFF8FA]',
      score: '82%',
      scoreColor: 'text-[#FF408A]'
    },
    {
      name: 'Aisha Khan',
      status: 'READY',
      statusColor: 'bg-[#A6FFC7] text-[#1EA13F]',
      score: '94%',
      scoreColor: 'text-[#34C759]'
    },
    {
      name: 'Neha Singh',
      status: 'DEPLOYED',
      statusColor: 'bg-[#C8EDFF] text-[#2388B9]',
      score: '88%',
      scoreColor: 'text-[#17678E]'
    },
    {
      name: 'Kavita Devi',
      status: 'ASSESSMENT',
      statusColor: 'bg-[#FFDAD6] text-[#FF383C]',
      score: '71%',
      scoreColor: 'text-[#FF383C]'
    }
  ];

  const journeySteps = [
    { name: 'Mobilization', status: 'Ongoing', state: 'completed' },
    { name: 'Registration', status: 'Verified', state: 'completed' },
    { name: 'Readiness', status: 'In Review', state: 'completed' },
    { name: 'Training', status: 'In Progress', state: 'active' },
    { name: 'Assessment', status: 'Under Evaluation', state: 'pending' },
    { name: 'Deployment', status: 'Ready to Deploy', state: 'pending' },
    { name: 'Employment', status: 'Successfully Placed', state: 'pending' },
    { name: 'Retention', status: 'Long-term Tracking', state: 'pending' }
  ];

  return (
    <section id="dashboard-preview" className="py-12 sm:py-14 lg:py-16 bg-white w-full relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-[#000] font-kaiseiTokumin text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-2.5">
            Complete Programme Visibility in One Dashboard
          </h2>
          <p className="text-[#787878] font-inter text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Monitor every candidate, every programme, and every outcome through powerful dashboards that enable faster decisions, proactive interventions, and improved programme performance.
          </p>
        </div>

        {/* Dashboard Frame / Mock Container */}
        <div className="rounded-[24px] sm:rounded-[30px] border border-[#787878]/30 bg-white shadow-[0_12px_40px_-10px_rgba(0,0,0,0.06)] overflow-hidden">
          
          {/* Top Mockup Navigation Bar */}
          <div className="flex flex-wrap lg:flex-nowrap py-3 px-4 sm:px-6 lg:px-8 justify-between items-center border-b border-[#C6C6CD]/60 bg-white gap-3">
            
            {/* Brand Logo */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button 
                onClick={() => {
                  const scrollContainer = document.getElementById('scroll-container');
                  if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
                  else window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cursor-pointer text-left focus:outline-none"
              >
                <p className="text-[#191C1D] font-plusJakartaSans text-sm sm:text-base font-bold tracking-tight">
                  Even Transparency
                </p>
              </button>
            </div>

            {/* Nav Tabs */}
            <div className="order-3 lg:order-2 w-full lg:w-auto flex items-center justify-center overflow-x-auto no-scrollbar py-0.5">
              <div className="flex items-center gap-5 sm:gap-8">
                <button className="cursor-pointer pb-0.5 border-b-2 border-black font-inter text-xs sm:text-sm font-bold text-black whitespace-nowrap">
                  Dashboard
                </button>
                <button className="cursor-pointer pb-0.5 text-[#787878] font-inter text-xs sm:text-sm font-medium hover:text-black transition-colors whitespace-nowrap">
                  Candidates
                </button>
                <button className="cursor-pointer pb-0.5 text-[#787878] font-inter text-xs sm:text-sm font-medium hover:text-black transition-colors whitespace-nowrap">
                  Training
                </button>
                <button className="cursor-pointer pb-0.5 text-[#787878] font-inter text-xs sm:text-sm font-medium hover:text-black transition-colors whitespace-nowrap">
                  Reports
                </button>
              </div>
            </div>

            {/* Top Right Controls */}
            <div className="order-2 lg:order-3 flex items-center gap-2 shrink-0">
              {/* Search Bar */}
              <div className="hidden sm:flex items-center rounded-full border border-[#787878]/40 bg-white px-3 py-1 gap-1.5 w-32 sm:w-40 lg:w-48">
                <Search className="w-3.5 h-3.5 text-[#787878] shrink-0" />
                <input 
                  type="text"
                  placeholder="Search"
                  disabled
                  className="bg-transparent border-none outline-none text-xs text-[#787878] placeholder-[#787878] w-full cursor-default"
                />
              </div>

              {/* Notification Button */}
              <div className="flex justify-center items-center rounded-xl border border-[#787878]/40 bg-white w-8 h-8 text-black hover:bg-slate-50 transition-colors cursor-pointer">
                <Bell className="w-3.5 h-3.5 text-slate-800" />
              </div>

              {/* Settings Button */}
              <div className="flex justify-center items-center rounded-xl border border-[#787878]/40 bg-white w-8 h-8 text-black hover:bg-slate-50 transition-colors cursor-pointer">
                <Settings className="w-3.5 h-3.5 text-slate-800" />
              </div>

              {/* User Avatar */}
              <div className="flex justify-center items-center rounded-xl bg-[#FF408A] w-8 h-8 shadow-xs cursor-pointer">
                <span className="text-white font-inter text-xs font-bold">
                  et
                </span>
              </div>
            </div>

          </div>

          {/* Main Inner Content Body */}
          <div className="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 bg-white">
            
            {/* 1. Stat Cards Grid (4 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              
              {/* Stat 1 */}
              <div className="flex items-center gap-3 p-3.5 rounded-[16px] border border-[#787878]/30 bg-white shadow-2xs">
                <div className="flex justify-center items-center shrink-0 rounded-xl bg-[#FFF8FA] border border-[#FF408A]/10 w-9 h-9 text-[#FF408A]">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#787878] font-inter text-[10px] font-semibold tracking-wider uppercase">
                    TOTAL CANDIDATES
                  </p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-black font-inter text-lg sm:text-xl font-bold tracking-tight">
                      12,458
                    </p>
                    <span className="text-[10px] font-semibold text-black bg-[#FFF8FA] px-1.5 py-0.5 rounded-md border border-[#FF408A]/10">
                      +18%
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-3 p-3.5 rounded-[16px] border border-[#787878]/30 bg-white shadow-2xs">
                <div className="flex justify-center items-center shrink-0 rounded-xl bg-[#FFF8FA] border border-[#FF408A]/10 w-9 h-9 text-[#FF408A]">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#787878] font-inter text-[10px] font-semibold tracking-wider uppercase">
                    In Training
                  </p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-black font-inter text-lg sm:text-xl font-bold tracking-tight">
                      3,124
                    </p>
                    <span className="text-[10px] font-semibold text-black bg-[#FFF8FA] px-1.5 py-0.5 rounded-md border border-[#FF408A]/10 whitespace-nowrap">
                      28 Active Batches
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center gap-3 p-3.5 rounded-[16px] border border-[#787878]/30 bg-white shadow-2xs">
                <div className="flex justify-center items-center shrink-0 rounded-xl bg-[#FFF8FA] border border-[#FF408A]/10 w-9 h-9 text-[#FF408A]">
                  <Target className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#787878] font-inter text-[10px] font-semibold tracking-wider uppercase">
                    Placed
                  </p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-black font-inter text-lg sm:text-xl font-bold tracking-tight">
                      5,048
                    </p>
                    <span className="text-[10px] font-semibold text-black bg-[#FFF8FA] px-1.5 py-0.5 rounded-md border border-[#FF408A]/10 whitespace-nowrap">
                      91% Rate
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex items-center gap-3 p-3.5 rounded-[16px] border border-[#787878]/30 bg-white shadow-2xs">
                <div className="flex justify-center items-center shrink-0 rounded-xl bg-[#FFF8FA] border border-[#FF408A]/10 w-9 h-9 text-[#FF408A]">
                  <Percent className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#787878] font-inter text-[10px] font-semibold tracking-wider uppercase">
                    Retention Rate
                  </p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-black font-inter text-lg sm:text-xl font-bold tracking-tight">
                      83%
                    </p>
                    <span className="text-[10px] font-semibold text-black bg-[#FFF8FA] px-1.5 py-0.5 rounded-md border border-[#FF408A]/10 whitespace-nowrap">
                      +6% IMPROV
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* 2. 3-Column Panels Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
              
              {/* Column 1: Candidate Journey (3/12 cols) */}
              <div className="lg:col-span-3 rounded-[20px] border border-[#787878]/30 bg-white p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg width="16" height="18" viewBox="0 0 18 20" fill="none" className="text-[#FF408A] shrink-0">
                      <path d="M8 20V15C8 14.0667 7.85833 13.375 7.575 12.925C7.29167 12.475 6.91667 12.0333 6.45 11.6L7.875 10.175C8.075 10.3583 8.26667 10.5542 8.45 10.7625C8.63333 10.9708 8.81667 11.1917 9 11.425C9.23333 11.1083 9.47083 10.8292 9.7125 10.5875C9.95417 10.3458 10.2 10.1083 10.45 9.875C11.0833 9.29167 11.6583 8.61667 12.175 7.85C12.6917 7.08333 12.9667 5.74167 13 3.825L11.425 5.4L10 4L14 0L18 4L16.6 5.4L15 3.825C14.9667 6.20833 14.6 7.90417 13.9 8.9125C13.2 9.92083 12.5 10.7417 11.8 11.375C11.2667 11.8583 10.8333 12.3292 10.5 12.7875C10.1667 13.2458 10 13.9833 10 15V20H8ZM3.2 6.175C3.13333 5.84167 3.0875 5.475 3.0625 5.075C3.0375 4.675 3.01667 4.25833 3 3.825L1.4 5.4L0 4L4 0L8 4L6.575 5.4L5 3.85C5 4.2 5.01667 4.52917 5.05 4.8375C5.08333 5.14583 5.11667 5.43333 5.15 5.7L3.2 6.175ZM5.35 10.575C5.01667 10.225 4.69583 9.81667 4.3875 9.35C4.07917 8.88333 3.80833 8.30833 3.575 7.625L5.5 7.15C5.66667 7.6 5.85833 7.98333 6.075 8.3C6.29167 8.61667 6.525 8.9 6.775 9.15L5.35 10.575Z" fill="#FF408A"/>
                    </svg>
                    <p className="text-[#191C1D] font-inter text-sm sm:text-base font-bold">
                      Candidate Journey
                    </p>
                  </div>

                  {/* Connected Timeline */}
                  <div className="relative pl-6 space-y-2.5">
                    <div className="absolute left-[9px] top-1.5 bottom-1.5 w-0.5 bg-[#C6C6CD]/60" />

                    {journeySteps.map((step, idx) => {
                      const isCompleted = step.state === 'completed';
                      const isActive = step.state === 'active';

                      return (
                        <div key={idx} className="relative flex items-start gap-2.5">
                          <div className="absolute -left-6 top-0.5">
                            {isCompleted && (
                              <div className="w-5 h-5 rounded-full bg-[#FF408A] flex items-center justify-center">
                                <Check className="w-3 h-3 text-white stroke-[3]" />
                              </div>
                            )}

                            {isActive && (
                              <div className="w-5 h-5 rounded-full bg-[#FF408A] border-3 border-[#FFF8FA] flex items-center justify-center">
                                <div className="w-1 h-1 rounded-full bg-white" />
                              </div>
                            )}

                            {!isCompleted && !isActive && (
                              <div className="w-5 h-5 rounded-full bg-[#FFF8FA] border border-slate-200" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className={`font-inter text-xs font-bold leading-tight ${isActive ? 'text-[#FF408A]' : 'text-[#191C1D]'}`}>
                              {step.name}
                            </p>
                            <p className="text-[#787878] font-inter text-[10px] leading-tight mt-0.5">
                              {step.status}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Column 2: Active Candidates (5/12 cols) */}
              <div className="lg:col-span-5 rounded-[20px] border border-[#787878]/30 bg-white p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[#191C1D] font-inter text-sm sm:text-base font-bold">
                      Active Candidates
                    </p>
                  </div>

                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#FFF9FB] border-b border-[#FFF8FA]">
                          <th className="py-2 px-2.5 text-[10px] font-bold text-black font-inter uppercase">
                            CANDIDATE
                          </th>
                          <th className="py-2 px-2.5 text-[10px] font-bold text-black font-inter uppercase">
                            STATUS
                          </th>
                          <th className="py-2 px-2.5 text-[10px] font-bold text-black font-inter uppercase">
                            SCORE
                          </th>
                          <th className="py-2 px-2.5 text-[10px] font-bold text-black font-inter uppercase text-right">
                            ACTION
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E1E3E4]/70">
                        {candidates.map((c, i) => (
                          <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-2.5 text-xs font-bold text-black font-inter whitespace-nowrap">
                              {c.name}
                            </td>
                            <td className="py-2.5 px-2.5 whitespace-nowrap">
                              <span className={`inline-block py-0.5 px-2 rounded-lg text-[9.5px] font-bold font-plusJakartaSans tracking-wide ${c.statusColor}`}>
                                {c.status}
                              </span>
                            </td>
                            <td className={`py-2.5 px-2.5 text-xs font-bold font-inter ${c.scoreColor}`}>
                              {c.score}
                            </td>
                            <td className="py-2.5 px-2.5 text-right">
                              <button className="cursor-pointer text-[#45464D] hover:text-black p-0.5">
                                <MoreVertical className="w-3.5 h-3.5 ml-auto" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button 
                    onClick={onOpenDemoModal}
                    className="cursor-pointer w-full py-2 px-3 rounded-lg border border-black hover:bg-black hover:text-white text-black font-inter text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 group"
                  >
                    <span>View All Candidates</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* Column 3: Aggregate Readiness (4/12 cols) */}
              <div className="md:col-span-2 lg:col-span-4 rounded-[20px] border border-[#787878]/30 bg-white p-4 sm:p-5 flex flex-col items-center justify-between text-center shadow-2xs">
                
                <div className="w-full">
                  <p className="text-[#787878] font-inter text-xs font-bold tracking-wider uppercase">
                    AGGREGATE READINESS
                  </p>
                </div>

                {/* Circular Score Gauge */}
                <div className="my-4 flex items-center justify-center">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-[5px] border-[#FF408A] bg-white flex flex-col items-center justify-center shadow-xs">
                    <span className="text-black font-plusJakartaSans text-2xl sm:text-3xl font-extrabold tracking-tight">
                      82%
                    </span>
                    <span className="text-[#787878] font-inter text-[9px] font-semibold tracking-wider uppercase mt-0.5">
                      DEPLOYMENT SCORE
                    </span>
                  </div>
                </div>

                <div className="w-full bg-[#FFF8FA] border border-[#FF408A]/10 rounded-xl p-3 text-center">
                  <p className="text-[#FF408A] font-plusJakartaSans text-lg sm:text-xl font-bold">
                    4,286
                  </p>
                  <p className="text-[#45464D] font-plusJakartaSans text-[11px] font-semibold tracking-wide mt-0.5">
                    Candidates Ready for Deployment
                  </p>
                </div>

                <p className="text-[#787878] font-plusJakartaSans text-[10.5px] leading-snug max-w-xs mt-3">
                  Based on internal benchmarks and partner requirements across 12 sectors.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
