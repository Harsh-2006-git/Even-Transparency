import React from 'react';
import { Mail, Phone, Shield } from 'lucide-react';

export default function HomeFooter({ onOpenDemoModal }) {
  const scrollToSection = (targetId) => {
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
  };

  return (
    <footer className="bg-[#000] text-white pt-16 pb-8 px-6 lg:px-16 border-t border-slate-800 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-12 border-b border-slate-800/80">
        
        {/* Brand Info Column */}
        <div className="lg:col-span-2 space-y-6">
          <div 
            onClick={() => {
              const scrollContainer = document.getElementById('scroll-container');
              if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FF408A] flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-inriaSerif text-2xl font-bold leading-tight tracking-tight">
              Even Transparency
            </span>
          </div>

          <p className="text-slate-400 font-inter text-sm leading-relaxed max-w-sm">
            Complete visibility across the candidate journey from mobilization to long-term employment helping organizations deliver measurable workforce outcomes.
          </p>
          
          {/* Contact Details */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-slate-300 font-inter text-xs sm:text-sm">
              <Mail className="w-4 h-4 text-[#FF408A] shrink-0" />
              <span>hello@evenshift.com</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300 font-inter text-xs sm:text-sm">
              <Phone className="w-4 h-4 text-[#FF408A] shrink-0" />
              <span>+91 XXXXX XXXXX</span>
            </div>
          </div>
        </div>

        {/* Column 1: Platform */}
        <div className="space-y-4">
          <h4 className="text-white font-inter text-base font-bold tracking-tight">
            Platform
          </h4>
          <ul className="space-y-2.5 font-inter text-sm text-slate-400 font-medium">
            <li>
              <button 
                onClick={() => scrollToSection('candidates')}
                className="hover:text-[#FF408A] transition-colors cursor-pointer text-left block w-full py-0.5"
              >
                Candidate Journey
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('platform')}
                className="hover:text-[#FF408A] transition-colors cursor-pointer text-left block w-full py-0.5"
              >
                Dashboard
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('features')}
                className="hover:text-[#FF408A] transition-colors cursor-pointer text-left block w-full py-0.5"
              >
                Key Features
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('stakeholders')}
                className="hover:text-[#FF408A] transition-colors cursor-pointer text-left block w-full py-0.5"
              >
                Role-Based Access
              </button>
            </li>
          </ul>
        </div>

        {/* Column 2: Solutions */}
        <div className="space-y-4">
          <h4 className="text-white font-inter text-base font-bold tracking-tight">
            Solutions
          </h4>
          <ul className="space-y-2.5 font-inter text-sm text-slate-400 font-medium">
            <li>
              <button onClick={onOpenDemoModal} className="hover:text-[#FF408A] transition-colors cursor-pointer text-left block w-full py-0.5">
                Skilling Organizations
              </button>
            </li>
            <li>
              <button onClick={onOpenDemoModal} className="hover:text-[#FF408A] transition-colors cursor-pointer text-left block w-full py-0.5">
                Workforce Development
              </button>
            </li>
            <li>
              <button onClick={onOpenDemoModal} className="hover:text-[#FF408A] transition-colors cursor-pointer text-left block w-full py-0.5">
                Logistics
              </button>
            </li>
            <li>
              <button onClick={onOpenDemoModal} className="hover:text-[#FF408A] transition-colors cursor-pointer text-left block w-full py-0.5">
                Employment Programmes
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Company */}
        <div className="space-y-4">
          <h4 className="text-white font-inter text-base font-bold tracking-tight">
            Company
          </h4>
          <ul className="space-y-2.5 font-inter text-sm text-slate-400 font-medium">
            <li>
              <button 
                onClick={() => scrollToSection('about')}
                className="hover:text-[#FF408A] transition-colors cursor-pointer text-left block w-full py-0.5"
              >
                About Even Transparency
              </button>
            </li>
            <li>
              <button onClick={onOpenDemoModal} className="hover:text-[#FF408A] transition-colors cursor-pointer text-left block w-full py-0.5">
                Contact
              </button>
            </li>
            <li>
              <button onClick={onOpenDemoModal} className="hover:text-[#FF408A] transition-colors cursor-pointer text-left block w-full py-0.5">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={onOpenDemoModal} className="hover:text-[#FF408A] transition-colors cursor-pointer text-left block w-full py-0.5">
                Terms of Use
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between font-inter text-xs text-slate-500 gap-4">
        <p className="text-center sm:text-left">
          &copy; 2026 Even Transparency. All Rights Reserved.
        </p>
        <div className="flex items-center gap-6">
          <button onClick={onOpenDemoModal} className="hover:text-slate-300 transition-colors cursor-pointer">
            Privacy Policy
          </button>
          <button onClick={onOpenDemoModal} className="hover:text-slate-300 transition-colors cursor-pointer">
            Terms of Service
          </button>
        </div>
      </div>
    </footer>
  );
}
