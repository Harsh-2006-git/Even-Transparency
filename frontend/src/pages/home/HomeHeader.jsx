import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  ChevronRight, 
  Calendar, 
  Mail 
} from 'lucide-react';

export default function HomeHeader({ onOpenDemoModal }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    setIsSidebarOpen(false);

    const targetElement = document.getElementById(targetId);
    const scrollContainer = document.getElementById('scroll-container');

    if (targetElement && scrollContainer) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      const targetScrollTop = scrollContainer.scrollTop + (targetRect.top - containerRect.top) - 70;
      scrollContainer.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth'
      });
    } else if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (window.history.pushState) {
      window.history.pushState(null, '', `#${targetId}`);
    }
  };

  const navItems = [
    {
      id: 'platform',
      label: 'Platform',
      sub: 'Overview & Dashboard'
    },
    {
      id: 'candidates',
      label: 'Candidates',
      sub: '7 Lifecycle Stages'
    },
    {
      id: 'features',
      label: 'Features',
      sub: 'Intelligent Management'
    },
    {
      id: 'about',
      label: 'About',
      sub: 'Why Choose Us'
    }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-[64px] sm:h-[68px] bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 md:px-8 lg:px-16 flex items-center justify-between z-50 shadow-2xs">
        {/* Brand Logo & Name */}
        <div 
          onClick={(e) => {
            const scrollContainer = document.getElementById('scroll-container');
            if (scrollContainer) {
              scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="cursor-pointer flex items-center gap-2 sm:gap-3 group shrink-0"
        >
          <img 
            src="/logo.png" 
            alt="Even Transparency Logo" 
            className="h-8 sm:h-9 lg:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="text-[#010101] font-inriaSerif text-[16.5px] min-[360px]:text-[18px] sm:text-2xl lg:text-[25px] font-bold tracking-tight whitespace-nowrap">
            Even Transparency
          </span>
        </div>

        {/* Center Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <a 
            href="#platform" 
            onClick={(e) => handleLinkClick(e, 'platform')}
            className="text-[#010101] font-inter text-sm font-semibold hover:text-[#FF408A] transition-colors cursor-pointer"
          >
            Platform
          </a>
          <a 
            href="#candidates" 
            onClick={(e) => handleLinkClick(e, 'candidates')}
            className="text-[#212121] font-inter text-sm font-semibold hover:text-[#FF408A] transition-colors cursor-pointer"
          >
            Candidates
          </a>
          <a 
            href="#features" 
            onClick={(e) => handleLinkClick(e, 'features')}
            className="text-[#212121] font-inter text-sm font-semibold hover:text-[#FF408A] transition-colors cursor-pointer"
          >
            Features
          </a>
          <a 
            href="#about" 
            onClick={(e) => handleLinkClick(e, 'about')}
            className="text-[#212121] font-inter text-sm font-semibold hover:text-[#FF408A] transition-colors cursor-pointer"
          >
            About
          </a>
        </nav>

        {/* Right Action Button: Stays on Landing Page */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button 
            onClick={onOpenDemoModal}
            className="cursor-pointer text-nowrap py-1 sm:py-1.5 px-3 sm:px-5 justify-center items-center rounded-full border border-[#000] bg-white hover:bg-black hover:text-white text-[#000] font-plusJakartaSans text-[11px] sm:text-sm font-bold transition-all shadow-2xs"
          >
            Login
          </button>

          {/* Mobile Hamburger Button */}
          <button 
            onClick={toggleSidebar}
            className="lg:hidden cursor-pointer p-1 sm:p-1.5 rounded-lg border border-slate-200 text-[#010101] hover:bg-slate-50 transition-colors"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </header>

      {/* Backdrop for Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity lg:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <aside 
        className={`fixed top-0 right-0 h-full w-[290px] sm:w-[320px] bg-white z-55 shadow-2xl transition-transform duration-300 ease-out lg:hidden flex flex-col border-l border-slate-100 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-[#FFF8FA]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#FF408A]/20 flex items-center justify-center shadow-2xs">
              <img 
                src="/logo.png" 
                alt="Even Transparency Logo" 
                className="h-7.5 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <span className="text-[#010101] font-inriaSerif text-lg font-bold whitespace-nowrap">
              Even Transparency
            </span>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="p-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-500 hover:text-black border border-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col justify-start gap-3">
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleLinkClick(e, item.id)}
                className="flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-[#FFF8FA] border border-transparent hover:border-[#FF408A]/20 transition-all duration-200 group cursor-pointer"
              >
                <div className="flex flex-col text-left">
                  <span className="text-slate-900 font-inter text-[15px] font-bold group-hover:text-[#FF408A] transition-colors">
                    {item.label}
                  </span>
                  <span className="text-slate-400 font-inter text-xs mt-0.5">
                    {item.sub}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#FF408A] group-hover:translate-x-1 transition-all" />
              </a>
            ))}
          </nav>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-2.5">
          <button 
            onClick={() => { setIsSidebarOpen(false); if (onOpenDemoModal) onOpenDemoModal(); }}
            className="cursor-pointer w-full py-2.5 px-4 rounded-full bg-black hover:bg-[#1a1a1a] text-white font-inter font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-[#FF408A]" />
            <span>Book a Demo</span>
          </button>

          <button 
            onClick={() => { setIsSidebarOpen(false); if (onOpenDemoModal) onOpenDemoModal(); }}
            className="cursor-pointer w-full py-2.5 px-4 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-black font-inter font-bold text-xs text-center transition-all shadow-2xs"
          >
            Login to Portal
          </button>

          <div className="flex items-center justify-center gap-2 text-slate-400 font-inter text-[10.5px] pt-1">
            <Mail className="w-3 h-3 text-[#FF408A]" />
            <span>hello@evenshift.com</span>
          </div>
        </div>
      </aside>
    </>
  );
}
