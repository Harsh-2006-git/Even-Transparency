import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-[68px] bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 lg:px-16 flex items-center justify-between z-50 shadow-2xs">
        {/* Brand Logo */}
        <div 
          onClick={(e) => {
            const scrollContainer = document.getElementById('scroll-container');
            if (scrollContainer) {
              scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="cursor-pointer flex items-center gap-2"
        >
          <span className="text-[#010101] font-inriaSerif text-xl sm:text-2xl font-bold tracking-tight">
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
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenDemoModal}
            className="cursor-pointer text-nowrap py-1.5 px-5 justify-center items-center rounded-full border border-[#000] bg-white hover:bg-black hover:text-white text-[#000] font-plusJakartaSans text-xs sm:text-sm font-bold transition-all shadow-2xs"
          >
            Login
          </button>

          {/* Mobile Hamburger Button */}
          <button 
            onClick={toggleSidebar}
            className="lg:hidden cursor-pointer p-1.5 rounded-lg border border-slate-200 text-[#010101]"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Backdrop for Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity lg:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <aside 
        className={`fixed top-0 right-0 h-full w-[280px] bg-white z-55 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden flex flex-col p-5 border-l border-slate-100 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <span className="text-[#010101] font-inriaSerif text-lg font-bold">
            Even Transparency
          </span>
          <button onClick={toggleSidebar} className="p-1 rounded-lg text-slate-500 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 py-4 flex-1">
          <a 
            href="#platform"
            onClick={(e) => handleLinkClick(e, 'platform')}
            className="text-[#010101] font-inter text-sm font-semibold py-2.5 px-3 rounded-lg hover:bg-slate-50"
          >
            Platform
          </a>
          <a 
            href="#candidates"
            onClick={(e) => handleLinkClick(e, 'candidates')}
            className="text-[#212121] font-inter text-sm font-semibold py-2.5 px-3 rounded-lg hover:bg-slate-50"
          >
            Candidates
          </a>
          <a 
            href="#features"
            onClick={(e) => handleLinkClick(e, 'features')}
            className="text-[#212121] font-inter text-sm font-semibold py-2.5 px-3 rounded-lg hover:bg-slate-50"
          >
            Features
          </a>
          <a 
            href="#about"
            onClick={(e) => handleLinkClick(e, 'about')}
            className="text-[#212121] font-inter text-sm font-semibold py-2.5 px-3 rounded-lg hover:bg-slate-50"
          >
            About
          </a>
        </nav>

        {/* Mobile Login Button: Stays on Landing Page */}
        <div className="pt-4 border-t border-slate-100">
          <button 
            onClick={() => { setIsSidebarOpen(false); if (onOpenDemoModal) onOpenDemoModal(); }}
            className="cursor-pointer w-full py-2.5 px-4 rounded-full border border-black bg-white hover:bg-black hover:text-white text-black font-inter font-bold text-xs text-center transition-colors shadow-2xs"
          >
            Login / Book Demo
          </button>
        </div>
      </aside>
    </>
  );
}
