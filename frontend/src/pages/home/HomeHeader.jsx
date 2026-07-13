import React, { useState } from 'react';

export default function HomeHeader({ onNavigate }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    setIsSidebarOpen(false);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-[80px] bg-white border-b border-slate-200 px-4 md:px-8 lg:px-24 flex items-center justify-between z-50 shadow-xs">
        {/* Logo */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="cursor-pointer flex items-center gap-0.5 sm:gap-2"
        >
          <img src="/logo.png" className="h-[36px] sm:h-[48px] w-auto object-contain" alt="Even Cargo Logo" />
          <div className="flex flex-col text-left justify-center">
            <span className="text-[#0142C8] font-manrope text-lg sm:text-xl md:text-[22px] font-bold leading-tight tracking-tight">
              Even Cargo
            </span>
            <span className="font-medium text-[#000]/65 text-[11px] sm:text-xs md:text-[15px] font-inter leading-none mt-0.5">
              Apprenticeships
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <a 
            href="#candidates" 
            onClick={(e) => handleLinkClick(e, 'candidates')}
            className="text-[#212121] hover:text-[#0142C8] font-inter text-sm font-semibold leading-7 transition-colors tracking-[-0.03em]"
          >
            Candidates
          </a>
          <a 
            href="#employers" 
            onClick={(e) => handleLinkClick(e, 'employers')}
            className="text-[#212121] hover:text-[#0142C8] font-inter text-sm font-semibold leading-7 transition-colors tracking-[-0.03em]"
          >
            Employers
          </a>
          <a 
            href="#how-it-works" 
            onClick={(e) => handleLinkClick(e, 'how-it-works')}
            className="text-[#212121] hover:text-[#0142C8] font-inter text-sm font-semibold leading-7 transition-colors tracking-[-0.03em]"
          >
            How It Works
          </a>
          <a 
            href="#about" 
            onClick={(e) => handleLinkClick(e, 'about')}
            className="text-[#212121] hover:text-[#0142C8] font-inter text-sm font-semibold leading-7 transition-colors tracking-[-0.03em]"
          >
            About Even Cargo
          </a>
        </nav>

        {/* Action Buttons (Desktop & Mobile) */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Desktop Only Buttons */}
          <button 
            onClick={() => onNavigate('candidate')}
            className="hidden lg:flex cursor-pointer text-nowrap py-2 px-4 justify-center items-center rounded-[8px] bg-[#0142C8] hover:bg-[#0135A0] text-white font-inter text-sm font-semibold transition shadow-sm"
          >
            Register as Candidate
          </button>
          <button 
            onClick={() => onNavigate('employer')}
            className="hidden lg:flex cursor-pointer text-nowrap py-2 px-4 justify-center items-center rounded-[8px] border border-[#0142C8] hover:bg-[#EFF1FF] text-[#0142C8] font-inter text-sm font-semibold transition"
          >
            Partner as Employer
          </button>

          {/* Mobile Only CTA Button */}
          <button 
            onClick={() => onNavigate('candidate')}
            className="lg:hidden cursor-pointer text-nowrap py-1.5 px-3 rounded-lg bg-[#0142C8] hover:bg-[#0135A0] text-white font-inter text-xs sm:text-sm font-bold transition shadow-xs"
          >
            Register
          </button>

          {/* Hamburger Icon Button for Mobile */}
          <button 
            onClick={toggleSidebar}
            className="lg:hidden cursor-pointer p-1.5 rounded-lg border border-slate-200 hover:bg-[#EFF1FF] text-[#0142C8] transition shrink-0"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Backdrop for Mobile Sidebar Drawer */}
      {isSidebarOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 transition-opacity duration-300 lg:hidden"
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside 
        className={`fixed top-0 right-0 h-full w-[280px] bg-white z-55 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden flex flex-col p-6 border-l border-slate-100 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 gap-2">
          <div 
            onClick={() => {
              setIsSidebarOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer flex items-center gap-1 sm:gap-2"
          >
            <img src="/logo.png" className="h-[32px] sm:h-[40px] w-auto object-contain" alt="Even Cargo Logo" />
            <div className="flex flex-col text-left justify-center">
              <span className="text-[#0142C8] font-manrope text-sm sm:text-base font-bold leading-tight tracking-tight">
                Even Cargo
              </span>
              <span className="font-medium text-[#000]/65 text-[9px] sm:text-xs font-inter leading-none mt-0.5">
                Apprenticeships
              </span>
            </div>
          </div>
          <button 
            onClick={toggleSidebar}
            className="cursor-pointer p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <nav className="flex flex-col gap-4 py-8 flex-1">
          <a 
            href="#candidates"
            onClick={(e) => handleLinkClick(e, 'candidates')}
            className="text-[#212121] hover:text-[#0142C8] font-inter text-base font-bold transition-colors py-2 border-b border-slate-50"
          >
            Candidates
          </a>
          <a 
            href="#employers"
            onClick={(e) => handleLinkClick(e, 'employers')}
            className="text-[#212121] hover:text-[#0142C8] font-inter text-base font-bold transition-colors py-2 border-b border-slate-50"
          >
            Employers
          </a>
          <a 
            href="#how-it-works"
            onClick={(e) => handleLinkClick(e, 'how-it-works')}
            className="text-[#212121] hover:text-[#0142C8] font-inter text-base font-bold transition-colors py-2 border-b border-slate-50"
          >
            How It Works
          </a>
          <a 
            href="#about"
            onClick={(e) => handleLinkClick(e, 'about')}
            className="text-[#212121] hover:text-[#0142C8] font-inter text-base font-bold transition-colors py-2 border-b border-slate-50"
          >
            About Even Cargo
          </a>
        </nav>

        {/* Drawer Auth Actions */}
        <div className="flex flex-col gap-3 pt-6 border-t border-slate-100">
          <button 
            onClick={() => { setIsSidebarOpen(false); onNavigate('candidate'); }}
            className="cursor-pointer w-full py-2.5 px-4 rounded-lg bg-[#0142C8] hover:bg-[#0135A0] text-white font-inter text-sm font-bold transition shadow-xs text-center"
          >
            Register as Candidate
          </button>
          <button 
            onClick={() => { setIsSidebarOpen(false); onNavigate('employer'); }}
            className="cursor-pointer w-full py-2.5 px-4 rounded-lg border-2 border-[#0142C8] hover:bg-[#EFF1FF] text-[#0142C8] font-inter text-sm font-bold transition text-center"
          >
            Partner as Employer
          </button>
        </div>
      </aside>
    </>
  );
}
