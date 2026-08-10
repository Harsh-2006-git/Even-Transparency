import { useState, useEffect } from 'react';
import {
  Mail,
  Search,
  Send,
  Eye,
  Code,
  Sliders,
  Check,
  Copy,
  RefreshCw,
  Monitor,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  User,
  Building,
  Shield,
  X,
  Sparkles,
  Sun,
  Moon,
  ExternalLink,
  Share2,
  Menu,
  Cpu,
  Layers,
  Activity,
  RotateCcw,
  AlertOctagon,
  Inbox,
  ArrowUpRight
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const fmtTime = (v) => {
  if (!v) return '—';
  const d = new Date(v);
  return isNaN(d) ? '—' : d.toLocaleDateString('en-IN', {
    month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
};

export default function EmailTemplates({ showToast }) {
  const [mainView, setMainView] = useState('templates'); // 'templates' | 'queue'
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'code' | 'editor'
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [emailTheme, setEmailTheme] = useState('light'); // 'light' | 'dark'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Queue Monitor State
  const [queueData, setQueueData] = useState({
    stats: { activeWorkers: 0, maxConcurrency: 3, queued: 0, processing: 0, sent: 0, failed: 0, total: 0 },
    queuedItems: [],
    historyItems: []
  });
  const [loadingQueue, setLoadingQueue] = useState(false);
  const [queuePriorityFilter, setQueuePriorityFilter] = useState('All');
  const [queueStatusFilter, setQueueStatusFilter] = useState('All');
  const [queueSearch, setQueueSearch] = useState('');
  const [retryingLogId, setRetryingLogId] = useState(null);

  // Compiled preview state
  const [compiledPreview, setCompiledPreview] = useState({ subject: '', html: '' });
  const [compiling, setCompiling] = useState(false);
  const [sampleDataJson, setSampleDataJson] = useState('{}');
  const [jsonError, setJsonError] = useState(null);

  // Send Test Modal state
  const [showTestModal, setShowTestModal] = useState(false);
  const [testRecipient, setTestRecipient] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Fetch templates list on mount
  useEffect(() => {
    fetchTemplates();
    fetchQueueData();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/notifications/templates`);
      if (!res.ok) throw new Error('Failed to fetch template list');
      const data = await res.json();
      if (data.success && data.templates.length > 0) {
        setTemplates(data.templates);
        // Select first candidate template by default
        const first = data.templates[0];
        setSelectedTemplate(first);
        setSampleDataJson(JSON.stringify(first.sampleData, null, 2));
        compileTemplatePreview(first.id, first.sampleData, emailTheme);
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Failed to load email templates', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchQueueData = async () => {
    try {
      setLoadingQueue(true);
      const res = await fetch(`${API}/notifications/queue`);
      if (!res.ok) throw new Error('Failed to fetch queue monitor state');
      const data = await res.json();
      if (data.success) {
        setQueueData({
          stats: data.stats || { activeWorkers: 0, maxConcurrency: 3, queued: 0, processing: 0, sent: 0, failed: 0, total: 0 },
          queuedItems: data.queuedItems || [],
          historyItems: data.historyItems || []
        });
      }
    } catch (err) {
      console.error('Fetch queue error:', err);
    } finally {
      setLoadingQueue(false);
    }
  };

  const handleRetryEmail = async (logId = null) => {
    try {
      setRetryingLogId(logId || 'ALL');
      const res = await fetch(`${API}/notifications/queue/retry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (showToast) showToast(data.message || 'Email re-queued with HIGH priority', 'success');
        fetchQueueData();
      } else {
        throw new Error(data.error || 'Failed to retry dispatch');
      }
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
    } finally {
      setRetryingLogId(null);
    }
  };

  const compileTemplatePreview = async (type, sampleData, themeMode = emailTheme) => {
    try {
      setCompiling(true);
      const payload = {
        ...sampleData,
        theme: themeMode
      };
      const res = await fetch(`${API}/notifications/templates/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, sampleData: payload })
      });
      if (!res.ok) throw new Error('Failed to compile preview');
      const data = await res.json();
      if (data.success) {
        setCompiledPreview({
          subject: data.subject,
          html: data.html
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCompiling(false);
    }
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setSampleDataJson(JSON.stringify(template.sampleData, null, 2));
    setJsonError(null);
    compileTemplatePreview(template.id, template.sampleData, emailTheme);
  };

  const handleToggleTheme = (newTheme) => {
    setEmailTheme(newTheme);
    if (!selectedTemplate) return;
    let parsed = selectedTemplate.sampleData;
    try {
      parsed = JSON.parse(sampleDataJson);
    } catch { /* fallback */ }
    compileTemplatePreview(selectedTemplate.id, parsed, newTheme);
  };

  const handleJsonChange = (val) => {
    setSampleDataJson(val);
    try {
      const parsed = JSON.parse(val);
      setJsonError(null);
      compileTemplatePreview(selectedTemplate.id, parsed, emailTheme);
    } catch (err) {
      setJsonError(err.message);
    }
  };

  const handleSendTestEmail = async (e) => {
    e.preventDefault();
    if (!testRecipient) return;

    try {
      setSendingTest(true);
      let payloadData = selectedTemplate.sampleData;
      try {
        payloadData = JSON.parse(sampleDataJson);
      } catch { /* use default */ }

      payloadData.theme = emailTheme;

      const res = await fetch(`${API}/notifications/send-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedTemplate.id,
          recipient: testRecipient,
          sampleData: payloadData
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (showToast) showToast(`Test email queued successfully for ${testRecipient}!`, 'success');
        setShowTestModal(false);
        setTestRecipient('');
        fetchQueueData();
      } else {
        throw new Error(data.error || 'Failed to send test email');
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast(err.message, 'error');
    } finally {
      setSendingTest(false);
    }
  };

  const copySourceCode = () => {
    if (!selectedTemplate) return;
    navigator.clipboard.writeText(selectedTemplate.rawContent);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyPublicPageUrl = () => {
    const publicUrl = `${window.location.origin}/email-templates`;
    navigator.clipboard.writeText(publicUrl);
    setCopiedUrl(true);
    if (showToast) showToast('Public Page URL copied to clipboard!', 'success');
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  // Filter templates
  const filteredTemplates = templates.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subjectTemplate.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === 'All' || t.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Filter queued & history items
  const filterQueueItem = (item) => {
    if (queuePriorityFilter !== 'All' && item.priority !== queuePriorityFilter) return false;
    if (queueStatusFilter !== 'All' && item.status !== queueStatusFilter) return false;
    if (queueSearch.trim()) {
      const q = queueSearch.toLowerCase();
      const matchRecipient = (item.recipient || '').toLowerCase().includes(q);
      const matchSubject = (item.subject || '').toLowerCase().includes(q);
      const matchType = (item.type || '').toLowerCase().includes(q);
      if (!matchRecipient && !matchSubject && !matchType) return false;
    }
    return true;
  };

  const filteredQueuedItems = queueData.queuedItems.filter(filterQueueItem);
  const filteredHistoryItems = queueData.historyItems.filter(filterQueueItem);

  const getCategoryBadgeClass = (category) => {
    if (category === 'Candidate') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (category === 'Employer') return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  const getPriorityBadge = (p) => {
    const priority = String(p || 'MEDIUM').toUpperCase();
    if (priority === 'HIGH') return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
    if (priority === 'LOW') return 'bg-slate-100 text-slate-700 border-slate-300';
    return 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
  };

  const getStatusBadge = (s) => {
    const status = String(s || 'QUEUED').toUpperCase();
    if (status === 'QUEUED') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (status === 'PROCESSING') return 'bg-purple-50 text-purple-700 border-purple-200 animate-pulse';
    if (status === 'SENT') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'FAILED') return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading email notification & queue system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-2xl md:rounded-3xl p-4 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-6 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 md:px-3 md:py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] md:text-xs font-semibold text-indigo-200 border border-white/15 mb-1.5 md:mb-3">
            <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-400" />
            Even Cargo Email & Parallel Queue Subsystem
          </div>
          <h1 className="text-base md:text-3xl font-extrabold tracking-tight">
            Email Service & Parallel Dispatch Queue
          </h1>
          <p className="hidden md:block text-slate-300 text-sm mt-1 max-w-2xl">
            Priority queue engine processing emails concurrently across all platform events with live queue state inspection and Nodemailer SMTP delivery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
          {/* Main Mode View Switcher: Templates vs Live Email Queue */}
          <div className="bg-white/10 p-1 rounded-2xl border border-white/15 flex items-center gap-1 backdrop-blur-xs">
            <button
              onClick={() => setMainView('templates')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                mainView === 'templates' ? 'bg-white text-indigo-950 shadow-md' : 'text-white/80 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>Email Templates ({templates.length})</span>
            </button>
            <button
              onClick={() => {
                setMainView('queue');
                fetchQueueData();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                mainView === 'queue' ? 'bg-indigo-600 text-white shadow-md' : 'text-white/80 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Live Email Queue</span>
              {queueData.stats.queued > 0 && (
                <span className="px-1.5 py-0.5 bg-amber-400 text-slate-900 text-[10px] font-black rounded-full">
                  {queueData.stats.queued}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => setShowTestModal(true)}
            className="hidden md:flex px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-semibold rounded-xl shadow-lg transition-all items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send Test Email</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: PARALLEL EMAIL QUEUE & DISPATCH MONITOR */}
      {mainView === 'queue' && (
        <div className="space-y-6">
          {/* Real-time Queue Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
                <Inbox className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Going to Send (Queued)</p>
                <p className="text-2xl font-extrabold text-slate-800">{queueData.stats.queued}</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="p-3 bg-purple-50 rounded-xl text-purple-600 border border-purple-100 relative">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Currently Sending</p>
                <p className="text-2xl font-extrabold text-purple-700">{queueData.stats.processing}</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sent Successfully</p>
                <p className="text-2xl font-extrabold text-emerald-600">{queueData.stats.sent}</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="p-3 bg-rose-50 rounded-xl text-rose-600 border border-rose-100">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Failed / Retries</p>
                <p className="text-2xl font-extrabold text-rose-600">{queueData.stats.failed}</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 shadow-sm flex items-center gap-3 col-span-2 md:col-span-1">
              <div className="p-3 bg-white/10 rounded-xl text-indigo-300 border border-white/15">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Parallel Workers</p>
                <p className="text-lg font-extrabold text-indigo-200">
                  {queueData.stats.activeWorkers} / {queueData.stats.maxConcurrency} Pool
                </p>
              </div>
            </div>
          </div>

          {/* Queue Filter Controls Header */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
              {/* Search */}
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search recipient, subject, or type..."
                  value={queueSearch}
                  onChange={(e) => setQueueSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Priority Filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 px-2">Priority:</span>
                {['All', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setQueuePriorityFilter(p)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      queuePriorityFilter === p ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={fetchQueueData}
                disabled={loadingQueue}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingQueue ? 'animate-spin text-indigo-600' : ''}`} />
                <span>Refresh Queue</span>
              </button>

              {queueData.stats.failed > 0 && (
                <button
                  onClick={() => handleRetryEmail(null)}
                  disabled={retryingLogId === 'ALL'}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry All Failed ({queueData.stats.failed})</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 1: Going to Send (QUEUED & PROCESSING Items) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-3">
            <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-bold text-slate-800">Going to Send (Pending Priority Queue)</h2>
              </div>
              <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
                {filteredQueuedItems.length} Enqueued Tasks
              </span>
            </div>

            {filteredQueuedItems.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-slate-700">Priority Queue Empty</p>
                <p className="text-xs text-slate-400">All queued emails have been dispatched by the parallel worker pool.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-slate-500 uppercase">
                    <tr>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Recipient Email</th>
                      <th className="p-3">Notification Type</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Enqueued Time</th>
                      <th className="p-3">Retries</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredQueuedItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-3">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[10px] ${getPriorityBadge(item.priority)}`}>
                            {item.priority || 'MEDIUM'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-md border text-[10px] font-bold ${getStatusBadge(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-800">{item.recipient}</td>
                        <td className="p-3 font-mono text-slate-600 text-[11px]">{item.type}</td>
                        <td className="p-3 font-medium text-slate-700 max-w-xs truncate">{item.subject}</td>
                        <td className="p-3 text-slate-500 font-mono text-[11px]">{fmtTime(item.createdAt)}</td>
                        <td className="p-3 font-mono text-slate-600">{item.retries || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 2: Already Sent & History (SENT & FAILED Items) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-3">
            <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-800">Already Sent & Dispatch History</h2>
              </div>
              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                {filteredHistoryItems.length} Recent Logs
              </span>
            </div>

            {filteredHistoryItems.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-xs">
                No email dispatch logs recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-slate-500 uppercase">
                    <tr>
                      <th className="p-3">Status</th>
                      <th className="p-3">Recipient Email</th>
                      <th className="p-3">Notification Type</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Sent / Error</th>
                      <th className="p-3">Updated Time</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredHistoryItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-md border text-[10px] font-bold ${getStatusBadge(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-800">{item.recipient}</td>
                        <td className="p-3 font-mono text-slate-600 text-[11px]">{item.type}</td>
                        <td className="p-3 font-medium text-slate-700 max-w-xs truncate">{item.subject}</td>
                        <td className="p-3 max-w-xs">
                          {item.status === 'FAILED' ? (
                            <span className="text-red-600 font-mono text-[11px] truncate block" title={item.error}>
                              ⚠️ {item.error || 'Delivery failure'}
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-mono text-[11px]">
                              ✅ Sent ({item.provider || 'SMTP'})
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-500 font-mono text-[11px]">{fmtTime(item.sentAt || item.updatedAt)}</td>
                        <td className="p-3 text-right">
                          {item.status === 'FAILED' && (
                            <button
                              onClick={() => handleRetryEmail(item.id)}
                              disabled={retryingLogId === item.id}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                            >
                              <RotateCcw className={`w-3 h-3 ${retryingLogId === item.id ? 'animate-spin' : ''}`} />
                              <span>Retry</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: EMAIL TEMPLATES DIRECTORY & VISUAL EDITOR */}
      {mainView === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sidebar: Email Templates Directory */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-600" />
                Email Templates
              </h2>
              <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200">
                {templates.length} Total
              </span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search template name or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['All', 'Candidate', 'Employer', 'Admin'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Templates Directory List */}
            <div className="space-y-1.5">
              {filteredTemplates.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No templates matched your search query.
                </div>
              ) : (
                filteredTemplates.map(t => {
                  const isSelected = selectedTemplate?.id === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTemplate(t)}
                      className={`w-full text-left p-3 rounded-xl transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50/80 border-indigo-300 shadow-sm'
                          : 'bg-white hover:bg-slate-50 border-transparent hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {t.name}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${getCategoryBadgeClass(t.category)}`}>
                          {t.category}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-500 truncate">
                        {t.id}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel: Template Preview Workspace */}
          <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col min-h-[680px]">
            {selectedTemplate ? (
              <>
                {/* Header Details Bar */}
                <div className="p-3.5 md:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
                  <div className="w-full md:w-auto flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm md:text-lg font-bold text-slate-900 truncate">
                          {selectedTemplate.name}
                        </h3>
                        <span className={`text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0 ${getCategoryBadgeClass(selectedTemplate.category)}`}>
                          {selectedTemplate.category}
                        </span>
                      </div>
                      <div className="hidden md:flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-semibold border border-slate-200">
                          Type: {selectedTemplate.id}
                        </span>
                        <span className="text-slate-600 truncate max-w-md">
                          Subject: <strong>{compiledPreview.subject || selectedTemplate.subjectTemplate}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 w-full md:w-auto">
                    {/* Theme Selector */}
                    <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1">
                      <button
                        onClick={() => handleToggleTheme('light')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                          emailTheme === 'light'
                            ? 'bg-white text-indigo-700 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span>Light</span>
                      </button>
                      <button
                        onClick={() => handleToggleTheme('dark')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                          emailTheme === 'dark'
                            ? 'bg-slate-900 text-indigo-300 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Dark</span>
                      </button>
                    </div>

                    {/* Viewport Switcher */}
                    <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1">
                      <button
                        onClick={() => setViewMode('desktop')}
                        className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                          viewMode === 'desktop'
                            ? 'bg-white text-indigo-700 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-semibold">Desktop</span>
                      </button>
                      <button
                        onClick={() => setViewMode('mobile')}
                        className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                          viewMode === 'mobile'
                            ? 'bg-white text-indigo-700 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-semibold">Mobile</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* View Tabs Header */}
                <div className="hidden md:flex border-b border-slate-200 px-5 items-center gap-6 bg-white">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                      activeTab === 'preview'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    Visual HTML Preview ({emailTheme === 'dark' ? 'Dark Mode' : 'Light Mode'})
                  </button>

                  <button
                    onClick={() => setActiveTab('code')}
                    className={`py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                      activeTab === 'code'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    Handlebars Source (.hbs)
                  </button>

                  <button
                    onClick={() => setActiveTab('editor')}
                    className={`py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                      activeTab === 'editor'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                    Sample Data JSON Editor
                    {jsonError && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                  </button>
                </div>

                {/* Workspace Content Area */}
                <div className={`p-0 md:p-6 flex-1 flex justify-center transition-colors duration-300 ${
                  emailTheme === 'dark' ? 'bg-slate-950' : 'bg-slate-100/60'
                }`}>
                  {activeTab === 'preview' && (
                    <div
                      className={`transition-all duration-300 w-full ${
                        viewMode === 'mobile'
                          ? 'w-full md:w-[375px] min-h-[680px] md:border-8 md:border-slate-800 md:rounded-[36px] shadow-2xl bg-white overflow-hidden md:my-4'
                          : 'w-full md:max-w-[720px] min-h-[680px] bg-white md:rounded-2xl shadow-md border border-slate-200/80 overflow-hidden'
                      }`}
                    >
                      {compiling ? (
                        <div className="w-full min-h-[680px] flex items-center justify-center bg-white text-indigo-600">
                          <RefreshCw className="w-6 h-6 animate-spin" />
                        </div>
                      ) : (
                        <iframe
                          title="Email Template Live Preview"
                          srcDoc={compiledPreview.html}
                          className="w-full min-h-[680px] h-full border-none"
                        />
                      )}
                    </div>
                  )}

                  {activeTab === 'code' && (
                    <div className="w-full max-w-4xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400 font-mono">
                          Template: backend/notifications/templates/{selectedTemplate.relativePath}.hbs
                        </span>
                        <button
                          onClick={copySourceCode}
                          className="px-3 py-1.5 bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                        </button>
                      </div>
                      <pre className="p-5 bg-slate-900 text-indigo-200 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                        {selectedTemplate.rawContent}
                      </pre>
                    </div>
                  )}

                  {activeTab === 'editor' && (
                    <div className="w-full max-w-3xl space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-300">
                          Interactive Variable Payload (JSON)
                        </label>
                        {jsonError ? (
                          <span className="text-xs text-red-400 font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Invalid JSON format
                          </span>
                        ) : (
                          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Valid JSON
                          </span>
                        )}
                      </div>
                      <textarea
                        rows={16}
                        value={sampleDataJson}
                        onChange={(e) => handleJsonChange(e.target.value)}
                        className="w-full p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-12 text-slate-400 text-sm">
                Select an email template from the left directory to view details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Send Test Email Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Send Live Test Email</h3>
                  <p className="text-xs text-slate-500">Dispatch test email to priority queue</p>
                </div>
              </div>
              <button
                onClick={() => setShowTestModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendTestEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Selected Template
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${selectedTemplate?.name} (${selectedTemplate?.id})`}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. admin@evencargo.in or candidate@gmail.com"
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTestModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingTest || !testRecipient}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  {sendingTest ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Queuing...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Dispatch to Queue
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
