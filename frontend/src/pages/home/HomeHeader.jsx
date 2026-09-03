import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ChevronRight, 
  ChevronDown,
  Calendar, 
  Mail,
  Shield,
  Users,
  GraduationCap,
  Briefcase,
  BarChart3,
  UserCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function HomeHeader({ onNavigate, onOpenDemoModal }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const rolePortals = [
    {
      id: 'admin',
      name: 'System Admin',
      sub: 'Super Admin & Governance',
      icon: Shield,
      color: 'text-[#FF408A]',
      bg: 'bg-[#FFF0F5]',
      border: 'hover:border-[#FF408A]/40'
    },
    {
      id: 'mobilizer',
      name: 'Field Mobilizer',
      sub: 'Candidate Intake & KYC',
      icon: Users,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'hover:border-rose-300'
    },
    {
      id: 'trainer',
      name: 'Skill Trainer',
      sub: 'Batches, Attendance & Grading',
      icon: GraduationCap,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'hover:border-indigo-300'
    },
    {
      id: 'placement',
      name: 'Placement Lead',
      sub: 'Employer Matching & Offers',
      icon: Briefcase,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'hover:border-emerald-300'
    },
    {
      id: 'me',
      name: 'M&E Team',
      sub: 'Retention & Audit Analytics',
      icon: BarChart3,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      border: 'hover:border-cyan-300'
    },
    {
      id: 'candidate',
      name: 'Candidate Portal',
      sub: 'Trainee Self-Service & Status',
      icon: UserCheck,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'hover:border-purple-300'
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

        {/* Right Action Buttons: Role Login Dropdown & Direct Portals */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Stakeholder Portals Dropdown */}
          <div className="relative hidden sm:block" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="cursor-pointer py-1.5 px-3.5 sm:px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-inter text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF408A]" />
              <span>Stakeholder Portals</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-[310px] bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Select Stakeholder Role</span>
                </div>

                <div className="py-1 space-y-1">
                  {rolePortals.map((portal) => {
                    const Icon = portal.icon;
                    return (
                      <button
                        key={portal.id}
                        onClick={() => {
                          setIsDropdownOpen(false);
                          if (onNavigate) onNavigate(`login/${portal.id}`);
                        }}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl text-left hover:bg-slate-50 border border-transparent ${portal.border} transition-all cursor-pointer group`}
                      >
                        <div className={`w-8 h-8 rounded-lg ${portal.bg} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-4 h-4 ${portal.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 group-hover:text-[#FF408A] transition-colors truncate">
                            {portal.name}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {portal.sub}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#FF408A] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Sign In / Hub */}
          <button 
            onClick={() => onNavigate && onNavigate('login')}
            className="cursor-pointer text-nowrap py-1.5 px-4 sm:px-5 justify-center items-center rounded-full bg-[#FF408A] hover:bg-[#E02670] text-white font-plusJakartaSans text-xs sm:text-sm font-bold transition-all shadow-xs"
          >
            Sign In
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
        className={`fixed top-0 right-0 h-full w-[300px] sm:w-[340px] bg-white z-55 shadow-2xl transition-transform duration-300 ease-out lg:hidden flex flex-col border-l border-slate-100 ${
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
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col justify-start gap-4">
          
          {/* Main Sections */}
          <div className="space-y-1">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">Site Navigation</p>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleLinkClick(e, item.id)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-[#FFF8FA] border border-transparent hover:border-[#FF408A]/20 transition-all duration-200 group cursor-pointer"
              >
                <div className="flex flex-col text-left">
                  <span className="text-slate-900 font-inter text-sm font-bold group-hover:text-[#FF408A] transition-colors">
                    {item.label}
                  </span>
                  <span className="text-slate-400 font-inter text-[11px]">
                    {item.sub}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#FF408A] group-hover:translate-x-1 transition-all" />
              </a>
            ))}
          </div>

          {/* Stakeholder Login Portals List */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">Stakeholder Login Portals</p>
            <div className="grid grid-cols-2 gap-2">
              {rolePortals.map((portal) => {
                const Icon = portal.icon;
                return (
                  <button
                    key={portal.id}
                    onClick={() => {
                      setIsSidebarOpen(false);
                      if (onNavigate) onNavigate(`login/${portal.id}`);
                    }}
                    className={`flex flex-col items-start p-2.5 rounded-xl border border-slate-200/80 hover:border-[#FF408A] hover:bg-slate-50 transition cursor-pointer text-left`}
                  >
                    <div className={`w-7 h-7 rounded-lg ${portal.bg} flex items-center justify-center mb-1.5`}>
                      <Icon className={`w-3.5 h-3.5 ${portal.color}`} />
                    </div>
                    <span className="text-xs font-bold text-slate-900 leading-tight truncate w-full">{portal.name}</span>
                    <span className="text-[10px] text-slate-400 truncate w-full">Sign In →</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-2">
          <button 
            onClick={() => { setIsSidebarOpen(false); if (onNavigate) onNavigate('login/admin'); }}
            className="cursor-pointer w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-inter font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <Shield className="w-3.5 h-3.5 text-[#FF408A]" />
            <span>Sign In to Portal</span>
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
