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
  Share2
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

export default function EmailTemplates({ showToast }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'code' | 'editor'
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [emailTheme, setEmailTheme] = useState('light'); // 'light' | 'dark'

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
        if (showToast) showToast(`Test email sent successfully to ${testRecipient}!`, 'success');
        setShowTestModal(false);
        setTestRecipient('');
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

  const handleIframeLoad = (e) => {
    try {
      const iframe = e.target;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        const contentHeight = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight, 600);
        iframe.style.height = `${contentHeight + 40}px`;

        doc.addEventListener('wheel', (event) => {
          const scrollContainer =
            document.getElementById('public-email-templates-scroll') ||
            document.getElementById('main-content-scroll') ||
            window;
          if (scrollContainer && scrollContainer.scrollBy) {
            scrollContainer.scrollBy({ top: event.deltaY, behavior: 'auto' });
          } else {
            window.scrollBy({ top: event.deltaY, behavior: 'auto' });
          }
        }, { passive: true });
      }
    } catch (err) {
      console.error(err);
    }
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

  const getCategoryBadgeClass = (category) => {
    if (category === 'Candidate') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (category === 'Employer') return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading email template workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-indigo-200 border border-white/15 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Even Cargo Email Design System
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Email Notifications Directory & Templates
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Inspect all 18 production email templates with live Light & Dark theme rendering, Handlebars source code viewer, interactive payload editor, and test email dispatch.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={copyPublicPageUrl}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-xs"
          >
            {copiedUrl ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                URL Copied!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-indigo-300" />
                Copy Public URL
              </>
            )}
          </button>

          <button
            onClick={() => setShowTestModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Send Test Email
          </button>
        </div>
      </div>

      {/* Main Split Layout: Sidebar (Templates Directory) + Main Preview Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar: Email Templates Navigation Directory */}
        <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-4">
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
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
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

        {/* Right Panel: Template Preview, Handlebars Source & Interactive Editor */}
        <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col min-h-[680px]">
          {selectedTemplate ? (
            <>
              {/* Header Details Bar */}
              <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">
                      {selectedTemplate.name}
                    </h3>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(selectedTemplate.category)}`}>
                      {selectedTemplate.category} Template
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-semibold border border-slate-200">
                      Type: {selectedTemplate.id}
                    </span>
                    <span className="text-slate-600 truncate max-w-md">
                      Subject: <strong>{compiledPreview.subject || selectedTemplate.subjectTemplate}</strong>
                    </span>
                  </div>
                </div>

                {/* Theme Selector (Light vs Dark) & Viewport Switcher (Desktop vs Mobile) */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Light / Dark Mode Toggle */}
                  <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1">
                    <button
                      onClick={() => handleToggleTheme('light')}
                      title="Light Theme Email Render"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        emailTheme === 'light'
                          ? 'bg-white text-indigo-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      Light
                    </button>
                    <button
                      onClick={() => handleToggleTheme('dark')}
                      title="Dark Theme Email Render"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        emailTheme === 'dark'
                          ? 'bg-slate-900 text-indigo-300 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5 text-indigo-400" />
                      Dark
                    </button>
                  </div>

                  {/* Viewport Switcher */}
                  <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1">
                    <button
                      onClick={() => setViewMode('desktop')}
                      title="Desktop View"
                      className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        viewMode === 'desktop'
                          ? 'bg-white text-indigo-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('mobile')}
                      title="Mobile View"
                      className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        viewMode === 'mobile'
                          ? 'bg-white text-indigo-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* View Tabs Header */}
              <div className="border-b border-slate-200 px-5 flex items-center gap-6 bg-white">
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
              <div className={`p-6 flex-1 flex justify-center transition-colors duration-300 ${
                emailTheme === 'dark' ? 'bg-slate-950' : 'bg-slate-100/60'
              }`}>
                {/* 1. Visual HTML Preview Tab */}
                {activeTab === 'preview' && (
                  <div
                    className={`transition-all duration-300 ${
                      viewMode === 'mobile'
                        ? 'w-[375px] min-h-[680px] border-8 border-slate-800 rounded-[36px] shadow-2xl bg-white overflow-hidden my-4'
                        : 'w-full max-w-[720px] min-h-[680px] bg-white rounded-2xl shadow-md border border-slate-200/80 overflow-hidden'
                    }`}
                  >
                    {compiling ? (
                      <div className={`w-full min-h-[680px] flex items-center justify-center ${
                        emailTheme === 'dark' ? 'bg-slate-900 text-indigo-400' : 'bg-white text-indigo-600'
                      }`}>
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

                {/* 2. Handlebars Source (.hbs) Tab */}
                {activeTab === 'code' && (
                  <div className="w-full max-w-4xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400 font-mono">
                        Template File: backend/notifications/templates/{selectedTemplate.relativePath}.hbs
                      </span>
                      <button
                        onClick={copySourceCode}
                        className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy Code
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-5 bg-slate-900 text-indigo-200 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner leading-relaxed">
                      {selectedTemplate.rawContent}
                    </pre>
                  </div>
                )}

                {/* 3. Sample Data JSON Editor Tab */}
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
                          Valid JSON - Updating live preview
                        </span>
                      )}
                    </div>
                    <textarea
                      rows={16}
                      value={sampleDataJson}
                      onChange={(e) => handleJsonChange(e.target.value)}
                      className={`w-full p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-2xl border focus:outline-none focus:ring-2 transition-all ${
                        jsonError
                          ? 'border-red-500 focus:ring-red-500/20'
                          : 'border-slate-800 focus:ring-indigo-500/20 focus:border-indigo-500'
                      }`}
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
                  <p className="text-xs text-slate-500">Dispatch test email using Nodemailer</p>
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
                  value={`${selectedTemplate?.name} (${selectedTemplate?.id}) [${emailTheme.toUpperCase()} THEME]`}
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
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingTest || !testRecipient}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  {sendingTest ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Dispatch Email
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
