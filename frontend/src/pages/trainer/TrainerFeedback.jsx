import React, { useState } from 'react';
import {
  FileText,
  MessageSquare,
  Sparkles,
  Search,
  Filter,
  Plus,
  Send,
  User,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ThumbsUp,
  X,
  Layers,
  Phone
} from 'lucide-react';

const INITIAL_FEEDBACK = [
  {
    id: 'fb-001',
    candidate_id: 'cand-001',
    candidate_code: 'EV-BLR-001',
    candidate_name: 'Pooja Sharma',
    trainer_name: 'Rahul Sharma',
    date: '2026-09-07',
    category: 'SKILL_PROGRESS', // SKILL_PROGRESS | BEHAVIOUR | INCIDENT | MOBILIZER_NOTE
    title: 'Rapid Battery Swap Mastery & Confidence',
    notes: 'Pooja has mastered the battery swap docking latch in under 2m 15s. Her vehicle pre-ride check is thorough. Highly motivated and ready for placement trial.',
    severity: 'POSITIVE',
    mobilizer: 'Amit Patel',
    shared_with_mobilizer: true
  },
  {
    id: 'fb-002',
    candidate_id: 'cand-003',
    candidate_code: 'EV-BLR-003',
    candidate_name: 'Kavita Devi',
    trainer_name: 'Rahul Sharma',
    date: '2026-09-05',
    category: 'MOBILIZER_NOTE',
    title: 'Attendance Catch-up Support Request',
    notes: 'Kavita missed Day 2 session due to medical leave. She attended a 1-hour special morning catch-up session and completed all slalom drills successfully.',
    severity: 'INFO',
    mobilizer: 'Priya Singh',
    shared_with_mobilizer: true
  },
  {
    id: 'fb-003',
    candidate_id: 'cand-002',
    candidate_code: 'EV-BLR-002',
    candidate_name: 'Ananya Roy',
    trainer_name: 'Rahul Sharma',
    date: '2026-09-04',
    category: 'SKILL_PROGRESS',
    title: 'Exceptional Wet Track Braking Control',
    notes: 'Demonstrated 70/30 progressive braking on wet painted track without wheel lock. Outstanding safety attitude.',
    severity: 'POSITIVE',
    mobilizer: 'Amit Patel',
    shared_with_mobilizer: false
  }
];

export default function TrainerFeedback({ user, onSectionChange }) {
  const [feedbackList, setFeedbackList] = useState(INITIAL_FEEDBACK);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // New Note Form state
  const [newCandidate, setNewCandidate] = useState('Pooja Sharma (EV-BLR-001)');
  const [newCategory, setNewCategory] = useState('SKILL_PROGRESS');
  const [newTitle, setNewTitle] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newSeverity, setNewSeverity] = useState('POSITIVE');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddFeedback = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newNotes.trim()) return;

    const newEntry = {
      id: `fb-${Date.now()}`,
      candidate_id: 'cand-001',
      candidate_code: 'EV-BLR-001',
      candidate_name: newCandidate.split(' (')[0],
      trainer_name: user?.full_name || 'Rahul Sharma',
      date: '2026-09-07',
      category: newCategory,
      title: newTitle,
      notes: newNotes,
      severity: newSeverity,
      mobilizer: 'Amit Patel',
      shared_with_mobilizer: true
    };

    setFeedbackList(prev => [newEntry, ...prev]);
    setIsNewModalOpen(false);
    setNewTitle('');
    setNewNotes('');
    showToast('Feedback note logged and shared with Mobilizer!');
  };

  const filteredList = feedbackList.filter(item => {
    const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesSearch =
      item.candidate_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.candidate_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-20 font-sans max-w-7xl mx-auto relative">
      {toast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl bg-emerald-600 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0F5] text-[#F72570] text-[11px] font-extrabold border border-[#F72570]/20">
            <MessageSquare className="w-3 h-3" />
            <span>Trainer Communication • Candidate Observations & Notes</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-kaiseiTokumin tracking-tight">
            Feedback, Notes & Mobilizer Exchange
          </h1>
          <p className="text-xs text-slate-500">
            Log candidate behavioural observations, skill improvement milestones, and coordinate support with field mobilizers.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="cursor-pointer px-4 py-2.5 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs font-bold shadow-sm shadow-[#F72570]/20 transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Observation Note</span>
        </button>
      </div>

      {/* ─── Filters & Search ────────────────────────────────────── */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search feedback notes by candidate, title, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/70 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl shrink-0 overflow-x-auto">
            {[
              { id: 'ALL', label: 'All Notes' },
              { id: 'SKILL_PROGRESS', label: 'Skill Progress' },
              { id: 'MOBILIZER_NOTE', label: 'Mobilizer Coordination' },
              { id: 'INCIDENT', label: 'Safety & Incidents' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                  categoryFilter === tab.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Feedback Notes List ─────────────────────────────────── */}
      <div className="space-y-3">
        {filteredList.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:border-slate-300 transition space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {item.candidate_code}
                </span>
                <span className="font-bold text-slate-900 text-sm">{item.candidate_name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  item.category === 'SKILL_PROGRESS' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  item.category === 'MOBILIZER_NOTE' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                  'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {item.category.replace('_', ' ')}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>{item.date}</span>
                <span>•</span>
                <span>Trainer: {item.trainer_name}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.notes}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Coordinated with Mobilizer: <strong className="text-slate-800">{item.mobilizer}</strong></span>
              </span>
              <span className="text-[11px] text-emerald-600 font-bold">Synced with Candidate Profile</span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── MODAL: NEW OBSERVATION NOTE ─────────────────────────── */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 sm:p-6 w-full max-w-md space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-kaiseiTokumin flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#F72570]" />
                <span>Add Candidate Observation Note</span>
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddFeedback} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Select Candidate</label>
                <select
                  value={newCandidate}
                  onChange={(e) => setNewCandidate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Pooja Sharma (EV-BLR-001)">Pooja Sharma (EV-BLR-001)</option>
                  <option value="Ananya Roy (EV-BLR-002)">Ananya Roy (EV-BLR-002)</option>
                  <option value="Kavita Devi (EV-BLR-003)">Kavita Devi (EV-BLR-003)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Observation Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="SKILL_PROGRESS">Skill Progress & Milestone</option>
                  <option value="MOBILIZER_NOTE">Mobilizer Support Coordination</option>
                  <option value="BEHAVIOUR">Attitude & Punctuality</option>
                  <option value="INCIDENT">Safety / Driving Incident</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Subject / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Completed Slalom Test Ahead of Schedule"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Detailed Observation Notes</label>
                <textarea
                  rows={4}
                  placeholder="Describe candidate performance, strengths, or specific support needed..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white font-bold transition shadow-xs cursor-pointer"
                >
                  Save & Share Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
