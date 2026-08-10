import { useState, useEffect } from 'react';
import {
  Inbox,
  Activity,
  CheckCircle2,
  AlertOctagon,
  Cpu,
  RefreshCw,
  Search,
  RotateCcw,
  Clock,
  Mail,
  Zap,
  Filter,
  Send
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const fmtTime = (v) => {
  if (!v) return '—';
  const d = new Date(v);
  return isNaN(d) ? '—' : d.toLocaleDateString('en-IN', {
    month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
};

export default function EmailQueuePage({ showToast }) {
  const [queueData, setQueueData] = useState({
    stats: { activeWorkers: 0, maxConcurrency: 3, queued: 0, processing: 0, sent: 0, failed: 0, total: 0 },
    queuedItems: [],
    historyItems: []
  });
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [retryingId, setRetryingId] = useState(null);

  const fetchQueueState = async () => {
    try {
      setLoading(true);
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
      if (showToast) showToast('Failed to load email queue state', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueState();
    // Auto-refresh queue every 10 seconds for real-time monitoring
    const timer = setInterval(fetchQueueState, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleRetry = async (logId = null) => {
    try {
      setRetryingId(logId || 'ALL');
      const res = await fetch(`${API}/notifications/queue/retry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (showToast) showToast(data.message || 'Email re-queued with HIGH priority', 'success');
        fetchQueueState();
      } else {
        throw new Error(data.error || 'Failed to retry dispatch');
      }
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
    } finally {
      setRetryingId(null);
    }
  };

  const filterItem = (item) => {
    if (priorityFilter !== 'All' && item.priority !== priorityFilter) return false;
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchRecipient = (item.recipient || '').toLowerCase().includes(q);
      const matchSubject = (item.subject || '').toLowerCase().includes(q);
      const matchType = (item.type || '').toLowerCase().includes(q);
      if (!matchRecipient && !matchSubject && !matchType) return false;
    }
    return true;
  };

  const filteredSendingQueue = queueData.queuedItems.filter(filterItem);
  const filteredSentQueue = queueData.historyItems.filter(filterItem);

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

  return (
    <div className="space-y-6 pb-12 text-left w-full">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-2xl md:rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-indigo-200 border border-white/15 mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Parallel Queue Dispatch System
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Email Queue Monitor
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl">
            Live inspection of the two email queues: emails currently sending or waiting in the priority queue, and emails already sended or failed.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchQueueState}
            disabled={loading}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 flex items-center gap-2 transition-all cursor-pointer backdrop-blur-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-300' : ''}`} />
            <span>Refresh Queues</span>
          </button>

          {queueData.stats.failed > 0 && (
            <button
              onClick={() => handleRetry(null)}
              disabled={retryingId === 'ALL'}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry All Failed ({queueData.stats.failed})</span>
            </button>
          )}
        </div>
      </div>

      {/* Top 5 Metrics Overview Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sending Queue</p>
            <p className="text-2xl font-extrabold text-slate-800">{queueData.stats.queued}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-purple-50 rounded-xl text-purple-600 border border-purple-100">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Sending</p>
            <p className="text-2xl font-extrabold text-purple-700">{queueData.stats.processing}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sended Emails</p>
            <p className="text-2xl font-extrabold text-emerald-600">{queueData.stats.sent}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600 border border-rose-100">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Failed Emails</p>
            <p className="text-2xl font-extrabold text-rose-600">{queueData.stats.failed}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 shadow-xs flex items-center gap-3 col-span-2 md:col-span-1">
          <div className="p-3 bg-white/10 rounded-xl text-indigo-300 border border-white/15">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Worker Pool</p>
            <p className="text-base font-extrabold text-indigo-200">
              {queueData.stats.activeWorkers} / {queueData.stats.maxConcurrency} Workers
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search email queue by recipient, subject, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9.5 pl-10 pr-4 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <span className="text-[10px] font-bold text-slate-500 px-2">Priority:</span>
            {['All', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`h-7 px-2.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  priorityFilter === p ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <span className="text-[10px] font-bold text-slate-500 px-2">Status:</span>
            {['All', 'QUEUED', 'PROCESSING', 'SENT', 'FAILED'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`h-7 px-2.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  statusFilter === s ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* QUEUE 1: SENDING & PENDING QUEUE */}
      <div className="bg-white rounded-2xl border border-amber-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-amber-100 bg-amber-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox className="w-5 h-5 text-amber-600" />
            <div>
              <h2 className="text-sm md:text-base font-extrabold text-slate-900">
                Queue 1: Sending & Pending Queue
              </h2>
              <p className="text-xs text-slate-500 font-medium">Emails currently queued or being dispatched by parallel workers</p>
            </div>
          </div>
          <span className="text-xs font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
            {filteredSendingQueue.length} Tasks Pending
          </span>
        </div>

        {filteredSendingQueue.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="text-sm font-bold text-slate-800">Queue 1 is Empty</p>
            <p className="text-xs text-slate-400">All queued email dispatches have been processed successfully.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-black text-[10px] text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Recipient</th>
                  <th className="px-4 py-3">Notification Type</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Enqueued Time</th>
                  <th className="px-4 py-3 text-center">Retries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredSendingQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[9px] ${getPriorityBadge(item.priority)}`}>
                        {item.priority || 'MEDIUM'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-md border text-[9px] font-black uppercase ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800">{item.recipient}</td>
                    <td className="px-4 py-3 font-mono text-slate-600 text-[11px]">{item.type}</td>
                    <td className="px-4 py-3 text-slate-700 max-w-xs truncate">{item.subject}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{fmtTime(item.createdAt)}</td>
                    <td className="px-4 py-3 text-center font-mono text-slate-600">{item.retries || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QUEUE 2: SENDED & DISPATCHED HISTORY QUEUE */}
      <div className="bg-white rounded-2xl border border-indigo-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-indigo-100 bg-indigo-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-sm md:text-base font-extrabold text-slate-900">
                Queue 2: Sended & Completed Queue
              </h2>
              <p className="text-xs text-slate-500 font-medium">Historical queue of successfully sended emails and failed dispatches</p>
            </div>
          </div>
          <span className="text-xs font-black bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full border border-indigo-300">
            {filteredSentQueue.length} Dispatched Items
          </span>
        </div>

        {filteredSentQueue.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-xs">
            No completed email dispatches in Queue 2.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-black text-[10px] text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Recipient</th>
                  <th className="px-4 py-3">Notification Type</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Delivery Info / Error</th>
                  <th className="px-4 py-3">Sended Time</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredSentQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-md border text-[9px] font-black uppercase ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800">{item.recipient}</td>
                    <td className="px-4 py-3 font-mono text-slate-600 text-[11px]">{item.type}</td>
                    <td className="px-4 py-3 text-slate-700 max-w-xs truncate">{item.subject}</td>
                    <td className="px-4 py-3 max-w-xs">
                      {item.status === 'FAILED' ? (
                        <span className="text-red-600 font-mono text-[11px] truncate block" title={item.error}>
                          ⚠️ {item.error || 'Delivery failed'}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-mono text-[11px]">
                          ✅ Delivered via {item.provider || 'SMTP'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{fmtTime(item.sentAt || item.updatedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      {item.status === 'FAILED' && (
                        <button
                          onClick={() => handleRetry(item.id)}
                          disabled={retryingId === item.id}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className={`w-3 h-3 ${retryingId === item.id ? 'animate-spin' : ''}`} />
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
  );
}
