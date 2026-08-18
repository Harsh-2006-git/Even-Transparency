import React, { useState } from 'react';
import { LayoutDashboard, Users, ShieldCheck, FileCheck2, Search, SlidersHorizontal, CheckCircle2, ChevronRight, BarChart3, Lock, Bell, Filter, Download } from 'lucide-react';

export default function KeyFeatures({ onNavigate, onOpenDemoModal }) {
  const [activeTab, setActiveTab] = useState('tracking');

  const candidatesData = [
    { name: 'Priya Sharma', status: 'TRAINING', score: '82%', badgeClass: 'bg-amber-100 text-amber-800' },
    { name: 'Aisha Khan', status: 'READY', score: '94%', badgeClass: 'bg-emerald-100 text-emerald-800' },
    { name: 'Neha Singh', status: 'DEPLOYED', score: '88%', badgeClass: 'bg-blue-100 text-blue-800' },
    { name: 'Kavita Devi', status: 'ASSESSMENT', score: '71%', badgeClass: 'bg-purple-100 text-purple-800' },
  ];

  const roles = [
    {
      title: "System Administrators",
      description: "Configure the platform, manage users, maintain master data, and oversee overall system performance."
    },
    {
      title: "Trainers",
      description: "Record attendance, update assessments, provide feedback, and evaluate candidate readiness."
    },
    {
      title: "Organization Administrators",
      description: "Monitor programme operations, assign resources, manage partners, and track organizational performance."
    },
    {
      title: "Placement Coordinators",
      description: "Match candidates with employers, manage deployments, and monitor employment status."
    },
    {
      title: "Mobilizers",
      description: "Register candidates, capture outreach information, upload documents, and monitor candidate progression."
    },
    {
      title: "Monitoring & Evaluation Teams",
      description: "Access organizational dashboards, generate reports, analyse KPIs, and measure programme impact."
    }
  ];

  const featuresList = [
    "Candidate Registration & Digital Profiles",
    "Mobilization Tracking",
    "Readiness Classification Engine",
    "Automated Training Recommendations",
    "Training & Assessment Management",
    "Candidate Progress Dashboard",
    "Deployment & Placement Tracking",
    "Employment & Retention Monitoring",
    "Role-Based User Access",
    "Configurable Reports & Analytics",
    "Real-Time Notifications & Alerts",
    "Advanced Search & Filters",
    "Exportable Excel & PDF Reports"
  ];

  return (
    <section id="features" className="py-16 lg:py-24 bg-slate-900 text-white w-full relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF408A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 1. SECTION: Complete Programme Visibility Dashboard Preview */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[#FF408A] font-inter text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#FF408A]/10 border border-[#FF408A]/20 px-4 py-1.5 rounded-full inline-block mb-3">
            Real-Time Analytics Showcase
          </span>
          <h2 className="text-white font-kaiseiTokumin text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            Complete Programme Visibility in One Dashboard
          </h2>
          <p className="text-slate-300 font-inter text-base sm:text-lg leading-relaxed">
            Monitor every candidate, every programme, and every outcome through powerful dashboards that enable faster decisions, proactive interventions, and improved programme performance.
          </p>

          {/* Dashboard Tab Switchers */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setActiveTab('tracking')}
              className={`cursor-pointer px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'tracking' 
                  ? 'bg-[#FF408A] text-white shadow-lg shadow-[#FF408A]/30' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              End-to-End Candidate Tracking
            </button>
            <button
              onClick={() => setActiveTab('dashboards')}
              className={`cursor-pointer px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'dashboards' 
                  ? 'bg-[#FF408A] text-white shadow-lg shadow-[#FF408A]/30' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Real-Time Dashboards
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`cursor-pointer px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'reports' 
                  ? 'bg-[#FF408A] text-white shadow-lg shadow-[#FF408A]/30' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Audit-Ready Reports
            </button>
          </div>
        </div>

        {/* Dashboard Mock Container */}
        <div className="bg-slate-950/80 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl mb-24">
          
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Candidates</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-white font-inter">12,458</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">+18%</span>
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">In Training</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-white font-inter">3,124</span>
                <span className="text-xs font-medium text-slate-400">28 Active Batches</span>
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Placed</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-white font-inter">5,048</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">91% Rate</span>
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Retention Rate</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-white font-inter">83%</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">+6% IMPROV</span>
              </div>
            </div>

          </div>

          {/* Mock Candidate Table */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-sm font-bold text-white font-inter flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FF408A]" />
                Live Candidate Pipeline Status
              </h4>
              <button 
                onClick={onOpenDemoModal}
                className="text-xs text-[#FF408A] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                View All Candidates
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3">Candidate</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Score</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-inter">
                  {candidatesData.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-3.5 font-bold text-white">{c.name}</td>
                      <td className="px-6 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${c.badgeClass}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-semibold text-emerald-400">{c.score}</td>
                      <td className="px-6 py-3.5 text-right">
                        <span className="text-xs text-slate-400 hover:text-white cursor-pointer underline">View Details</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Aggregate Readiness Score Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF408A]/20 text-[#FF408A] flex items-center justify-center font-black text-lg">
                4,286
              </div>
              <div>
                <p className="text-sm font-bold text-white">Candidates Ready for Deployment</p>
                <p className="text-xs text-slate-400">Based on internal benchmarks and partner requirements across 12 sectors.</p>
              </div>
            </div>
            <button 
              onClick={onOpenDemoModal}
              className="cursor-pointer py-2 px-5 rounded-full bg-[#FF408A] hover:bg-[#E02670] text-white font-inter text-xs font-bold transition-all shadow-md shrink-0"
            >
              Access Sector Deployments
            </button>
          </div>

        </div>

        {/* 2. SECTION: Designed for Every Stakeholder */}
        <div className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#FF408A] font-inter text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#FF408A]/10 border border-[#FF408A]/20 px-4 py-1.5 rounded-full inline-block mb-3">
              Multi-Tenant Security & Governance
            </span>
            <h2 className="text-white font-kaiseiTokumin text-3xl sm:text-4xl font-extrabold mb-4">
              Designed for Every Stakeholder
            </h2>
            <p className="text-slate-300 font-inter text-base sm:text-lg">
              Role-based access ensures every stakeholder has the right tools, insights, and responsibilities to manage candidate journeys efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role, idx) => (
              <div 
                key={idx}
                className="bg-slate-950/70 rounded-2xl p-6 border border-slate-800 hover:border-[#FF408A]/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-[#FF408A] flex items-center justify-center font-bold text-sm mb-4 group-hover:bg-[#FF408A] group-hover:text-white transition-all">
                  0{idx + 1}
                </div>
                <h3 className="text-lg font-bold text-white font-kaiseiTokumin mb-2 group-hover:text-[#FF408A] transition-colors">
                  {role.title}
                </h3>
                <p className="text-slate-400 font-inter text-sm leading-relaxed">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. SECTION: Powering Smarter Candidate Management (13 Feature Pills) */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-white font-kaiseiTokumin text-3xl sm:text-4xl font-extrabold mb-3">
              Powering Smarter Candidate Management
            </h2>
            <p className="text-slate-300 font-inter text-sm sm:text-base">
              Streamline candidate management with intelligent tools that improve visibility, automate workflows, and deliver better programme outcomes.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 max-w-5xl mx-auto">
            {featuresList.map((feat, i) => (
              <div 
                key={i}
                className="bg-slate-950/90 border border-slate-800 hover:border-[#FF408A]/40 text-slate-200 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all hover:bg-slate-900 hover:text-white"
              >
                <CheckCircle2 className="w-4 h-4 text-[#FF408A] shrink-0" />
                {feat}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
