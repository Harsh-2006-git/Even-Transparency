import React, { useState, useEffect } from 'react';
import HomeHeader from './HomeHeader';
import HomeHero from './HomeHero';
import DashboardSection from './DashboardSection';
import ProblemStatement from './ProblemStatement';
import ChallengesSolves from './ChallengesSolves';
import StakeholdersSection from './StakeholdersSection';
import SmartCandidateManagement from './SmartCandidateManagement';
import SingleSourceOfTruth from './SingleSourceOfTruth';
import HomeFooter from './HomeFooter';
import { X, Calendar, Send, CheckCircle2 } from 'lucide-react';

export default function HomeLanding({ onNavigate }) {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoForm, setDemoForm] = useState({
    fullName: '',
    email: '',
    organization: '',
    role: 'Organization Administrator',
    message: ''
  });

  const handleOpenDemoModal = () => {
    setDemoSubmitted(false);
    setIsDemoModalOpen(true);
  };

  const handleCloseDemoModal = () => {
    setIsDemoModalOpen(false);
  };

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setIsDemoModalOpen(false);
      setDemoSubmitted(false);
    }, 2500);
  };

  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const element = document.getElementById(hash);
        const scrollContainer = document.getElementById('scroll-container');
        if (element && scrollContainer) {
          const containerRect = scrollContainer.getBoundingClientRect();
          const targetRect = element.getBoundingClientRect();
          const targetScrollTop = scrollContainer.scrollTop + (targetRect.top - containerRect.top) - 70;
          scrollContainer.scrollTo({
            top: Math.max(0, targetScrollTop),
            behavior: 'smooth'
          });
        } else if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    handleHashScroll();
    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, []);

  // Intersection Observer for smooth scroll-reveal animations
  useEffect(() => {
    const observerOptions = {
      root: document.getElementById('scroll-container'),
      rootMargin: '0px',
      threshold: 0.05,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-element');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div
      id="scroll-container"
      className="w-full h-screen h-[100dvh] overflow-y-auto no-scrollbar bg-white text-slate-900 font-sans selection:bg-[#FF408A]/20 selection:text-[#FF408A] scroll-smooth relative"
    >
      {/* Scroll Reveal Style Sheet */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .reveal-element {
          opacity: 0;
          transform: translateY(50px) scale(0.98);
          filter: blur(2px);
          transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 0.9s cubic-bezier(0.16, 1, 0.3, 1),
                      filter 0.9s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity, filter;
        }
        .reveal-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 20s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      ` }} />

      {/* 1. Navigation Header */}
      <HomeHeader onNavigate={onNavigate} onOpenDemoModal={handleOpenDemoModal} />

      {/* 2. Main Hero Banner (Full 100vh Screen Viewport) */}
      <HomeHero onNavigate={onNavigate} onOpenDemoModal={handleOpenDemoModal} />

      {/* 2.5. Complete Programme Visibility in One Dashboard */}
      <div id="platform" className="reveal-element scroll-mt-20">
        <DashboardSection onNavigate={onNavigate} onOpenDemoModal={handleOpenDemoModal} />
      </div>

      {/* 3. Why Choose Even Transparency */}
      <div id="about" className="reveal-element scroll-mt-20">
        <ProblemStatement onNavigate={onNavigate} onOpenDemoModal={handleOpenDemoModal} />
      </div>

      {/* 3.5. Challenges Even Transparency Solves */}
      <div id="challenges" className="reveal-element scroll-mt-20">
        <ChallengesSolves />
      </div>

      {/* 4. Designed for Every Stakeholder */}
      <div id="stakeholders" className="reveal-element scroll-mt-20">
        <StakeholdersSection />
      </div>

      {/* 4.5. Powering Smarter Candidate Management & Features */}
      <div id="candidates" className="reveal-element scroll-mt-20">
        <div id="features">
          <SmartCandidateManagement onOpenDemoModal={handleOpenDemoModal} />
        </div>
      </div>

      {/* 5. A Single Source of Truth */}
      <div id="single-source" className="reveal-element scroll-mt-20">
        <SingleSourceOfTruth onNavigate={onNavigate} onOpenDemoModal={handleOpenDemoModal} />
      </div>

      {/* 6. Footer Component */}
      <HomeFooter onNavigate={onNavigate} onOpenDemoModal={handleOpenDemoModal} />

      {/* Interactive Book a Demo Modal */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">

            <button
              onClick={handleCloseDemoModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!demoSubmitted ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF8FA] border border-[#FF408A]/30 flex items-center justify-center text-[#FF408A]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-kaiseiTokumin text-slate-900">
                      Book a Platform Demo
                    </h3>
                    <p className="text-xs text-slate-500 font-inter">
                      Schedule a walk-through of the Even Transparency system
                    </p>
                  </div>
                </div>

                <form onSubmit={handleDemoSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Roy"
                      value={demoForm.fullName}
                      onChange={(e) => setDemoForm({ ...demoForm, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#FF408A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Work Email</label>
                    <input
                      type="email"
                      required
                      placeholder="name@organization.com"
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#FF408A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Organization Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Skill India Partner Org"
                      value={demoForm.organization}
                      onChange={(e) => setDemoForm({ ...demoForm, organization: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#FF408A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary Role</label>
                    <select
                      value={demoForm.role}
                      onChange={(e) => setDemoForm({ ...demoForm, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#FF408A]"
                    >
                      <option>Organization Administrator</option>
                      <option>Trainer / Assessor</option>
                      <option>Placement Coordinator</option>
                      <option>Mobilizer / Field Lead</option>
                      <option>Monitoring & Evaluation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Notes (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="Tell us about your candidate numbers or target outcomes..."
                      value={demoForm.message}
                      onChange={(e) => setDemoForm({ ...demoForm, message: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#FF408A]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="cursor-pointer w-full py-3.5 rounded-xl bg-[#FF408A] hover:bg-[#E02670] text-white font-inter text-sm font-bold transition shadow-md flex items-center justify-center gap-2 mt-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit Demo Request
                  </button>
                </form>
              </>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-kaiseiTokumin text-slate-900">
                  Demo Request Received!
                </h3>
                <p className="text-sm text-slate-600 max-w-xs mx-auto">
                  Our team will contact <span className="font-semibold text-slate-900">{demoForm.email}</span> within 24 hours to schedule your personalized demo.
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
