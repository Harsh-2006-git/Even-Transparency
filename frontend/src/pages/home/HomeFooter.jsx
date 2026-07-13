import React from 'react';

export default function HomeFooter({ onNavigate }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#EFF1FF] pt-12 pb-8 px-6 lg:px-24 text-left relative z-10 border-t border-[#0142C8]/10">
      <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
        
        {/* Brand Info Column */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-manrope text-2xl font-bold tracking-tight text-[#010101]">
            Even Cargo <span className="text-[#0142C8]">Apprenticeships</span>
          </h3>
          <p className="text-[#010101]/70 font-inter text-sm leading-relaxed max-w-[420px]">
            Connecting women candidates with verified employers across India through a safe, compliant, and technology-driven apprenticeship platform.
          </p>
          
          {/* Contact Details */}
          <div className="flex items-center gap-2 pt-2">
            {/* WhatsApp Icon (Solid Blue with White phone inside) */}
            <svg width="22" height="22" viewBox="0 0 448 512" className="shrink-0 select-none">
              <circle cx="224" cy="256" r="110" fill="#FFF" />
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" fill="#0142C8" />
            </svg>
            <span className="font-inter text-sm font-semibold text-[#010101]/80">
              +91xxx xxx xxx
            </span>
          </div>
        </div>

        {/* Link Columns */}
        {/* Candidates Links */}
        <div className="space-y-4 hidden md:block">
          <h4 className="text-[#010101] font-inter text-base font-bold">
            Candidates
          </h4>
          <ul className="space-y-2.5 font-inter text-sm text-[#010101]/70 font-medium">
            <li>
              <button onClick={() => onNavigate('candidate')} className="hover:text-[#0142C8] transition-colors cursor-pointer text-left block w-full py-0.5">
                Register
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('candidate')} className="hover:text-[#0142C8] transition-colors cursor-pointer text-left block w-full py-0.5">
                Browse Jobs
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('candidate')} className="hover:text-[#0142C8] transition-colors cursor-pointer text-left block w-full py-0.5">
                Track Application
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('candidate')} className="hover:text-[#0142C8] transition-colors cursor-pointer text-left block w-full py-0.5">
                Grievance Support
              </button>
            </li>
          </ul>
        </div>

        {/* Employers Links */}
        <div className="space-y-4 hidden md:block">
          <h4 className="text-[#010101] font-inter text-base font-bold">
            Employers
          </h4>
          <ul className="space-y-2.5 font-inter text-sm text-[#010101]/70 font-medium">
            <li>
              <button onClick={() => onNavigate('employer')} className="hover:text-[#0142C8] transition-colors cursor-pointer text-left block w-full py-0.5">
                Register
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('employer')} className="hover:text-[#0142C8] transition-colors cursor-pointer text-left block w-full py-0.5">
                Post a Job
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('employer')} className="hover:text-[#0142C8] transition-colors cursor-pointer text-left block w-full py-0.5">
                NAPS Compliance
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('employer')} className="hover:text-[#0142C8] transition-colors cursor-pointer text-left block w-full py-0.5">
                ESG Reports
              </button>
            </li>
          </ul>
        </div>

        {/* Company Links */}
        <div className="space-y-4 hidden md:block">
          <h4 className="text-[#010101] font-inter text-base font-bold">
            Company
          </h4>
          <ul className="space-y-2.5 font-inter text-sm text-[#010101]/70 font-medium">
            <li>
              <a href="#about" className="hover:text-[#0142C8] transition-colors block py-0.5">
                About Even Cargo
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#0142C8] transition-colors block py-0.5">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#0142C8] transition-colors block py-0.5">
                Terms of Use
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#0142C8] transition-colors block py-0.5">
                Contact
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright row */}
      <div className="w-full max-w-[1200px] mx-auto mt-8 pt-4 border-t border-[#010101]/10 flex justify-center font-inter text-xs md:text-sm font-semibold text-[#010101]/60">
        <p className="text-center">
          &copy; {currentYear} Even Cargo. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
