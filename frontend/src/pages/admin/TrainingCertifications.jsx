import React, { useState, useEffect } from 'react';
import {
  BadgeCheck,
  Award,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Calendar,
  Users,
  Eye,
  Printer,
  X,
  ShieldCheck
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/training';

export default function TrainingCertifications({ onSectionChange }) {
  const [batches, setBatches] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock initial certificates
  const [certificates, setCertificates] = useState([
    {
      id: 'cert-101',
      cert_number: 'ET-CERT-2026-001',
      candidate_name: 'Priya Sharma',
      candidate_code: 'ET-2026-001',
      course_title: 'Professional Two-Wheeler EV Pilot & Battery Management',
      module_code: 'MOD-EV-01',
      batch_code: 'BAT-2026-BLR-01',
      issue_date: '2026-03-05',
      trainer_name: 'Rahul Sharma',
      center_name: 'Bengaluru EV Excellence Centre',
      grade: 'DISTINCTION',
      score: '96%',
      status: 'VERIFIED_ON_CHAIN'
    },
    {
      id: 'cert-102',
      cert_number: 'ET-CERT-2026-002',
      candidate_name: 'Aisha Khan',
      candidate_code: 'ET-2026-002',
      course_title: 'Defensive Urban Riding & Last-Mile Safety Protocols',
      module_code: 'MOD-SAF-02',
      batch_code: 'BAT-2026-BLR-01',
      issue_date: '2026-03-05',
      trainer_name: 'Rahul Sharma',
      center_name: 'Bengaluru EV Excellence Centre',
      grade: 'EXCELLENT',
      score: '92%',
      status: 'VERIFIED_ON_CHAIN'
    },
    {
      id: 'cert-103',
      cert_number: 'ET-CERT-2026-003',
      candidate_name: 'Rani Kumari',
      candidate_code: 'ET-2026-003',
      course_title: 'Two-Wheeler EV Dynamics & Battery Swapping',
      module_code: 'MOD-EV-01',
      batch_code: 'BAT-2026-LKO-02',
      issue_date: '2026-02-28',
      trainer_name: 'Meena Yadav',
      center_name: 'Lucknow Prime Skill Hub',
      grade: 'DISTINCTION',
      score: '94%',
      status: 'VERIFIED_ON_CHAIN'
    },
    {
      id: 'cert-104',
      cert_number: 'ET-CERT-2026-004',
      candidate_name: 'Kavita Rawat',
      candidate_code: 'ET-2026-004',
      course_title: 'Defensive Urban Riding & Last-Mile Safety Protocols',
      module_code: 'MOD-SAF-02',
      batch_code: 'BAT-2026-LKO-02',
      issue_date: '2026-02-28',
      trainer_name: 'Meena Yadav',
      center_name: 'Lucknow Prime Skill Hub',
      grade: 'PASS',
      score: '84%',
      status: 'VERIFIED_ON_CHAIN'
    }
  ]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/batches`);
        const json = await res.json();
        if (json.success) setBatches(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  const filteredCerts = certificates.filter(c =>
    c.candidate_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.cert_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.batch_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.course_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* ─── Hero Banner (Pure Light Theme) ─────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 p-6 sm:p-8 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F5] text-[#F72570] text-xs font-bold border border-[#F72570]/20">
            <BadgeCheck className="w-3.5 h-3.5" />
            <span>CREDENTIAL VERIFICATION REGISTRY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-kaiseiTokumin text-slate-900">
            Training & Skilling Certifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Official Even Transparency digitized skill completion certificates with tamper-proof QR verification codes and graduation transcripts.
          </p>
        </div>
      </div>

      {/* ─── KPI Row ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Issued</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{certificates.length}</div>
          <p className="text-xs text-indigo-600 font-bold mt-1">Verified Credentials</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Distinction Rate</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">75%</div>
          <p className="text-xs text-slate-500 mt-1">Scored &gt; 90%</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Graduated Cohorts</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#F72570]">2 Batches</div>
          <p className="text-xs text-slate-500 mt-1">100% attendance verified</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Corporate Readiness</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-600">100%</div>
          <p className="text-xs text-slate-500 mt-1">Ready for deployment</p>
        </div>
      </div>

      {/* ─── Search & Filter Bar ──────────────────────────────────────────────── */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search certificate ID, candidate name, batch code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
          />
        </div>
      </div>

      {/* ─── Certificates Table ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Certificate ID</th>
                <th className="px-4 py-3.5">Candidate Details</th>
                <th className="px-4 py-3.5">Training Course Module</th>
                <th className="px-4 py-3.5">Batch Code</th>
                <th className="px-4 py-3.5">Issue Date</th>
                <th className="px-4 py-3.5">Final Score</th>
                <th className="px-5 py-3.5 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCerts.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-4 font-mono font-bold text-slate-900">
                    {cert.cert_number}
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-bold text-slate-900">{cert.candidate_name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{cert.candidate_code}</div>
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-800 max-w-xs truncate">
                    {cert.course_title}
                  </td>
                  <td className="px-4 py-4 font-mono text-slate-600">
                    {cert.batch_code}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {cert.issue_date}
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                      {cert.score} • {cert.grade}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View & Print</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Printable Certificate Preview Modal ─────────────────────────────── */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-8 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-slate-400">CERTIFICATE TRANSCRIPT</span>
              <button
                onClick={() => setSelectedCert(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Certificate Frame */}
            <div className="border-4 border-double border-slate-300 p-8 rounded-2xl text-center space-y-5 bg-gradient-to-b from-white via-pink-50/20 to-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F5] text-[#F72570] text-xs font-extrabold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EVEN MOBILITY FOUNDATION • SKILLING ACADEMY</span>
              </div>

              <h2 className="text-2xl font-bold font-kaiseiTokumin text-slate-900">
                Certificate of Competency & Completion
              </h2>

              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                This is to officially certify that
              </p>

              <div className="text-2xl font-extrabold text-[#F72570] font-kaiseiTokumin border-b border-slate-200 pb-2 inline-block px-8">
                {selectedCert.candidate_name}
              </div>

              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                has successfully completed the comprehensive professional skilling module in <br />
                <span className="font-bold text-slate-900 text-sm">{selectedCert.course_title}</span> <br />
                demonstrating exemplary defensive riding agility and safety compliance.
              </p>

              <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 text-xs text-slate-600">
                <div>
                  <div className="font-bold text-slate-900">{selectedCert.grade} ({selectedCert.score})</div>
                  <div className="text-[10px] text-slate-400">Assessment Grade</div>
                </div>
                <div>
                  <div className="font-bold text-slate-900">{selectedCert.issue_date}</div>
                  <div className="text-[10px] text-slate-400">Issued On</div>
                </div>
                <div>
                  <div className="font-bold text-slate-900 font-mono text-[11px]">{selectedCert.cert_number}</div>
                  <div className="text-[10px] text-slate-400">Credential ID</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedCert(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
