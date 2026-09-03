import React, { useState } from 'react';
import {
  User,
  Award,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  Download,
  Phone,
  Mail,
  Sparkles,
  FileText,
  HelpCircle
} from 'lucide-react';

export default function CandidateDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');

  const candidateInfo = {
    code: user?.candidate_code || 'ET-2026-001',
    name: user?.full_name || 'Priya Sharma',
    email: user?.email || 'priya.sharma@candidate.org',
    phone: user?.mobile_number || '+91 98765 11111',
    city: user?.assigned_city || 'Bengaluru, Karnataka',
    stage: 'IN_TRAINING',
    nf_category: 'NF1 (Fast-Track EV Rider)',
    readiness_score: 88,
    kyc_status: 'Verified (Aadhaar + DL)',
    batch: {
      name: 'Batch B-BLR-01 (EV Driving & Road Safety)',
      trainer: 'Ramesh Sen',
      center: 'Bengaluru EV Hub Campus',
      progress: '75%',
      attendance: '96%',
      modules_completed: '3 of 4'
    },
    deployment_offer: {
      employer: 'Amazon Logistics',
      role: 'EV Delivery Associate',
      wage: '₹17,500 / month',
      hub: 'Bengaluru South Delivery Hub',
      joining_date: 'March 1, 2026'
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* ─── Hero Banner ─────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold border border-white/10">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>KYC Verified Candidate • {candidateInfo.code}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-kaiseiTokumin">
            Welcome, {candidateInfo.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Track your training modules, attendance logs, assessment scores, and upcoming employment placement offer.
          </p>
        </div>

        <div className="z-10 flex items-center gap-2.5 shrink-0">
          <button className="cursor-pointer px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-2 border border-white/20">
            <Download className="w-3.5 h-3.5" />
            <span>ID Card & Certificate</span>
          </button>
        </div>
      </div>

      {/* ─── Candidate Key Status Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Readiness Score</div>
          <div className="text-3xl font-extrabold text-emerald-600">{candidateInfo.readiness_score}%</div>
          <p className="text-xs text-slate-500 mt-1">High deployment readiness</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">NF Category</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-700">NF1</div>
          <p className="text-xs text-slate-500 mt-1">Fast-track employment pathway</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Training Attendance</div>
          <div className="text-3xl font-extrabold text-slate-900">{candidateInfo.batch.attendance}</div>
          <p className="text-xs text-slate-500 mt-1">24 of 25 sessions attended</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Target Monthly Wage</div>
          <div className="text-3xl font-extrabold text-[#FF408A]">{candidateInfo.deployment_offer.wage}</div>
          <p className="text-xs text-slate-500 mt-1">With PF + Insurance Coverage</p>
        </div>
      </div>

      {/* ─── Training Progress & Placement Offer ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Training Journey Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-bold font-kaiseiTokumin text-slate-900">Training Progress</h3>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
              {candidateInfo.batch.progress} Completed
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-2xl">
              <div className="font-bold text-slate-900">{candidateInfo.batch.name}</div>
              <div className="text-slate-500 mt-0.5">Trainer: {candidateInfo.batch.trainer} • {candidateInfo.batch.center}</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span>Module 1: 2W EV Vehicle Operation</span>
                <span className="text-emerald-600 font-bold">Passed (88%)</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Module 2: Road Safety & Defensive Riding</span>
                <span className="text-emerald-600 font-bold">Passed (85%)</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Module 3: Smartphone Navigation & Etiquette</span>
                <span className="text-emerald-600 font-bold">Passed (92%)</span>
              </div>
              <div className="flex justify-between font-semibold text-purple-600">
                <span>Module 4: Final Practical Driving Assessment</span>
                <span className="font-bold">Scheduled (Next Mon)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Placement Offer Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold font-kaiseiTokumin text-slate-900">Deployment Placement Offer</h3>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Offer Ready
            </span>
          </div>

          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2.5 text-xs text-slate-800">
            <div className="flex justify-between py-1 border-b border-blue-100">
              <span className="text-slate-500">Hiring Employer:</span>
              <span className="font-bold text-slate-900">{candidateInfo.deployment_offer.employer}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-blue-100">
              <span className="text-slate-500">Assigned Role:</span>
              <span className="font-bold">{candidateInfo.deployment_offer.role}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-blue-100">
              <span className="text-slate-500">Monthly Compensation:</span>
              <span className="font-bold text-emerald-600">{candidateInfo.deployment_offer.wage}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Work Location:</span>
              <span className="font-bold">{candidateInfo.deployment_offer.hub}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button className="cursor-pointer px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition">
              Accept Deployment Offer
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
