import { useState, useEffect } from 'react';
import {
  PlusCircle, Pencil, Trash2, Save, X, ChevronDown, ChevronUp,
  HelpCircle, Plus, AlertTriangle
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const INPUT_TYPES = ['Radio', 'Dropdown', 'Number', 'Text', 'MultiSelect'];

const DOMAIN_COLORS = {
  A: 'bg-violet-50 border-violet-200 text-violet-700',
  B: 'bg-blue-50 border-blue-200 text-blue-700',
  C: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  D: 'bg-amber-50 border-amber-200 text-amber-700',
  E: 'bg-rose-50 border-rose-200 text-rose-700',
  F: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  G: 'bg-slate-100 border-slate-300 text-slate-700',
};

const emptyQuestion = {
  qNumber: '',
  domain: 'A',
  domainName: '',
  domainWeight: '',
  questionText: '',
  questionWeight: '',
  inputType: 'Radio',
  options: [{ text: '', score: '' }],
};

export default function QuestionManagement() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal / form state
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null); // null = add new
  const [form, setForm] = useState(emptyQuestion);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // Confirm delete
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Expand/collapse domain groups
  const [expandedDomains, setExpandedDomains] = useState({});

  // ── Fetch all questions ──────────────────────────────────────────────────
  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/questions`);
      if (!res.ok) throw new Error('Failed to load questions.');
      const data = await res.json();
      setQuestions(data);
      // Collapse all domains by default
      setExpandedDomains({});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuestions(); }, []);

  // ── Group by domain ──────────────────────────────────────────────────────
  const groupedByDomain = questions.reduce((acc, q) => {
    if (!acc[q.domain]) acc[q.domain] = [];
    acc[q.domain].push(q);
    return acc;
  }, {});

  // ── Open form for Add / Edit ─────────────────────────────────────────────
  const openAddForm = () => {
    setEditingQuestion(null);
    setForm(emptyQuestion);
    setFormError(null);
    setFormSuccess(null);
    setShowForm(true);
  };

  const openEditForm = (q) => {
    setEditingQuestion(q);
    setForm({
      qNumber: q.qNumber,
      domain: q.domain,
      domainName: q.domainName,
      domainWeight: String(Math.round(q.domainWeight * 100)),
      questionText: q.questionText,
      questionWeight: String(q.questionWeight),
      inputType: q.inputType,
      options: q.options && q.options.length > 0
        ? q.options.map(o => ({ text: o.text, score: String(o.score ?? '') }))
        : [{ text: '', score: '' }],
    });
    setFormError(null);
    setFormSuccess(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingQuestion(null);
    setForm(emptyQuestion);
    setFormError(null);
    setFormSuccess(null);
  };

  // ── Option management ────────────────────────────────────────────────────
  const addOption = () => {
    setForm(prev => ({ ...prev, options: [...prev.options, { text: '', score: '' }] }));
  };

  const removeOption = (index) => {
    setForm(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const updateOption = (index, field, value) => {
    setForm(prev => {
      const opts = [...prev.options];
      opts[index] = { ...opts[index], [field]: value };
      return { ...prev, options: opts };
    });
  };

  // ── Save (Create / Update) ───────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!form.qNumber.trim() || !form.domainName.trim() || !form.questionText.trim()) {
      setFormError('Q-Number, Domain Name, and Question Text are required.');
      return;
    }

    const domainWeightVal = parseFloat(form.domainWeight);
    const qWeightVal = parseInt(form.questionWeight);

    if (isNaN(domainWeightVal) || domainWeightVal <= 0 || domainWeightVal > 100) {
      setFormError('Domain Weight must be a number between 1 and 100 (%).');
      return;
    }
    if (isNaN(qWeightVal) || qWeightVal <= 0) {
      setFormError('Question Weight must be a positive number.');
      return;
    }

    const payload = {
      qNumber: form.qNumber.trim().toUpperCase(),
      domain: form.domain.trim().toUpperCase(),
      domainName: form.domainName.trim(),
      domainWeight: domainWeightVal / 100,
      questionText: form.questionText.trim(),
      questionWeight: qWeightVal,
      inputType: form.inputType,
      options: form.options
        .filter(o => o.text.trim())
        .map(o => ({ text: o.text.trim(), score: parseFloat(o.score) || 0 })),
    };
    const mockId = editingQuestion ? editingQuestion.id : `temp-${Date.now()}`;
    const optimisticQuestion = {
      ...payload,
      id: mockId,
      createdAt: editingQuestion ? editingQuestion.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setQuestions(prev => {
      if (!editingQuestion) return [...prev, optimisticQuestion];
      return prev.map(q => q.id === mockId ? optimisticQuestion : q);
    });

    closeForm();

    const url = editingQuestion
      ? `${API}/questions/${editingQuestion.id}`
      : `${API}/questions`;
    const method = editingQuestion ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => res.json().then(data => ({ res, data })))
      .then(({ res, data }) => {
        if (!res.ok) throw new Error(data.error || 'Failed to save question.');
        fetchQuestions();
      })
      .catch(err => {
        console.error(err);
        alert('Failed to save question: ' + err.message);
        fetchQuestions();
      });
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;

    const idToDelete = deleteTarget.id;
    setQuestions(prev => prev.filter(q => q.id !== idToDelete));
    setDeleteTarget(null);

    fetch(`${API}/questions/${idToDelete}`, { method: 'DELETE' })
      .then(res => res.json().then(data => ({ res, data })))
      .then(({ res, data }) => {
        if (!res.ok) throw new Error(data.error || 'Failed to delete.');
        fetchQuestions();
      })
      .catch(err => {
        console.error(err);
        alert('Failed to delete question: ' + err.message);
        fetchQuestions();
      });
  };

  const toggleDomain = (domain) => {
    setExpandedDomains(prev => ({ ...prev, [domain]: !prev[domain] }));
  };

  // ── Domain summary bar ───────────────────────────────────────────────────
  const getDomainMeta = (questions) => {
    const first = questions[0];
    return {
      name: first?.domainName || '',
      weight: first ? Math.round(first.domainWeight * 100) : 0,
      count: questions.length,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-indigo-600 shrink-0" strokeWidth={2.5} />
            Question Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit and delete assessment questions, domains, options and scoring weights.
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95 cursor-pointer shrink-0"
        >
          <PlusCircle className="h-4 w-4" strokeWidth={2.5} />
          Add New Question
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-xs">
          <p className="text-2xl font-black text-indigo-700">{questions.length}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Total Questions</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-xs">
          <p className="text-2xl font-black text-emerald-600">{Object.keys(groupedByDomain).length}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Domains</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-xs">
          <p className="text-2xl font-black text-amber-600">
            {questions.reduce((s, q) => s + q.questionWeight, 0)}
          </p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Total Weight</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-xs">
          <p className="text-2xl font-black text-rose-600">
            {questions.reduce((s, q) => s + (q.options?.length || 0), 0)}
          </p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Total Options</p>
        </div>
      </div>

      {/* Error or Loading */}
      {loading && (
        <div className="text-center py-12 text-slate-400 text-sm">Loading questions...</div>
      )}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-700 font-semibold flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Domain Groups */}
      {!loading && Object.entries(groupedByDomain).sort(([a], [b]) => a.localeCompare(b)).map(([domain, qs]) => {
        const meta = getDomainMeta(qs);
        const colorClass = DOMAIN_COLORS[domain] || 'bg-slate-100 border-slate-300 text-slate-700';
        const isExpanded = expandedDomains[domain];

        return (
          <div key={domain} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            {/* Domain Header */}
            <button
              onClick={() => toggleDomain(domain)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${colorClass}`}>
                  Domain {domain}
                </span>
                <div>
                  <span className="font-bold text-slate-800 text-sm">{meta.name}</span>
                  <span className="ml-2 text-[10px] text-slate-400 font-semibold">
                    {meta.count} questions · {meta.weight}% weight
                  </span>
                </div>
              </div>
              {isExpanded
                ? <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />}
            </button>

            {/* Questions list */}
            {isExpanded && (
              <div className="divide-y divide-slate-100">
                {qs.map(q => (
                  <div key={q.id} className="p-4 hover:bg-slate-50/60 transition">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Q-Number badge + Input type */}
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${colorClass}`}>
                            {q.qNumber}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-slate-50 border-slate-200 text-slate-500">
                            {q.inputType}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            Weight: <strong className="text-slate-700">{q.questionWeight}</strong>
                          </span>
                        </div>

                        {/* Question text */}
                        <p className="text-sm font-semibold text-slate-800 leading-snug">{q.questionText}</p>

                        {/* Options preview */}
                        {q.options && q.options.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {q.options.map((opt, i) => (
                              <span key={i} className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 rounded-lg px-2 py-0.5 font-medium">
                                {opt.text}
                                {opt.score !== undefined && (
                                  <span className="ml-1 text-indigo-600 font-bold">({opt.score})</span>
                                )}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => openEditForm(q)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-[11px] rounded-lg shadow-sm transition cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" strokeWidth={2.5} />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(q)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 hover:bg-rose-50 hover:border-rose-300 text-rose-600 font-semibold text-[11px] rounded-lg shadow-sm transition cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* ── ADD / EDIT MODAL ── */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-slate-900/50 backdrop-blur-sm overflow-y-auto py-6 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4.5 w-4.5 text-indigo-600" strokeWidth={2.5} />
                <h3 className="font-bold text-slate-800 text-sm">
                  {editingQuestion ? `Edit Question ${editingQuestion.qNumber}` : 'Add New Question'}
                </h3>
              </div>
              <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer">
                <X className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">

              {/* Row: Q-Number & Domain */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Q-Number *</label>
                  <input
                    type="text"
                    required
                    value={form.qNumber}
                    onChange={e => setForm(p => ({ ...p, qNumber: e.target.value }))}
                    placeholder="e.g. Q29"
                    className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Domain Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    value={form.domain}
                    onChange={e => setForm(p => ({ ...p, domain: e.target.value }))}
                    placeholder="e.g. A"
                    className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition uppercase"
                  />
                </div>
              </div>

              {/* Domain Name */}
              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Domain Name *</label>
                <input
                  type="text"
                  required
                  value={form.domainName}
                  onChange={e => setForm(p => ({ ...p, domainName: e.target.value }))}
                  placeholder="e.g. Economic Pressure & Financial Urgency"
                  className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
                />
              </div>

              {/* Row: Domain Weight % & Q-Weight & Input Type */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Domain Weight %</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    step={1}
                    value={form.domainWeight}
                    onChange={e => setForm(p => ({ ...p, domainWeight: e.target.value }))}
                    placeholder="e.g. 22"
                    className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-600 transition"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Q-Weight</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.questionWeight}
                    onChange={e => setForm(p => ({ ...p, questionWeight: e.target.value }))}
                    placeholder="e.g. 5"
                    className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-600 transition"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Input Type</label>
                  <select
                    value={form.inputType}
                    onChange={e => setForm(p => ({ ...p, inputType: e.target.value }))}
                    className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-600 transition"
                  >
                    {INPUT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Question Text *</label>
                <textarea
                  required
                  rows={3}
                  value={form.questionText}
                  onChange={e => setForm(p => ({ ...p, questionText: e.target.value }))}
                  placeholder="Enter the full question text..."
                  className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition resize-none"
                />
              </div>

              {/* Options */}
              {form.inputType !== 'Text' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-bold text-slate-500 uppercase tracking-wider">Options &amp; Scores</label>
                    <button
                      type="button"
                      onClick={addOption}
                      className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold text-[11px] transition cursor-pointer"
                    >
                      <Plus className="h-3 w-3" strokeWidth={3} />
                      Add Option
                    </button>
                  </div>

                  <div className="space-y-2">
                    {form.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={opt.text}
                          onChange={e => updateOption(i, 'text', e.target.value)}
                          placeholder={`Option ${i + 1} text`}
                          className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
                        />
                        <input
                          type="number"
                          value={opt.score}
                          onChange={e => updateOption(i, 'score', e.target.value)}
                          placeholder="Score"
                          className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(i)}
                          className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer shrink-0"
                        >
                          <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form feedback */}
              {formError && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-rose-700 font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-700 font-semibold">
                  {formSuccess}
                </div>
              )}

              {/* Form Actions */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition active:scale-95 cursor-pointer"
                >
                  <Save className="h-4 w-4" strokeWidth={2.5} />
                  {editingQuestion ? 'Update Question' : 'Create Question'}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-100 shrink-0">
                <Trash2 className="h-5 w-5 text-rose-600" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Delete Question {deleteTarget.qNumber}?</h3>
                <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3 leading-relaxed">
              "{deleteTarget.questionText}"
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition active:scale-95 cursor-pointer"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
