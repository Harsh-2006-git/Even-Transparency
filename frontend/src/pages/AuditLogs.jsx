import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { FileText, Search, Loader2, RefreshCw, Sliders, Wifi, WifiOff } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;          // e.g. http://localhost:5000/api
// Socket.io connects to the base origin, without the /api path
const SOCKET_URL = (() => {
  try {
    const url = new URL(API);
    return `${url.protocol}//${url.host}`; // → http://localhost:5000
  } catch {
    return 'http://localhost:5000';
  }
})();

export default function AuditLogs({ user }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const socketRef = useRef(null);

  // ── Initial data fetch ────────────────────────────────────────────────────
  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API}/audit-logs`, {
        headers: { 'x-admin-id': user.id }
      });
      if (!res.ok) throw new Error('Failed to fetch audit logs');
      const data = await res.json();
      setLogs(data);
      setNewCount(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchLogs();
  }, [user]);

  // ── Socket.io real-time connection ────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketConnected(true);
      console.log('[Socket.io] ✅ Connected to server. Socket ID:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket.io] ❌ Connection error:', err.message);
    });

    socket.on('disconnect', (reason) => {
      setSocketConnected(false);
      console.log('[Socket.io] ⚠️ Disconnected. Reason:', reason);
    });

    // Real-time new log event
    socket.on('audit:new', (log) => {
      console.log('[Socket.io] 📋 audit:new received:', log.action, log.entity);
      setLogs(prev => [log, ...prev]);
      setNewCount(prev => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      (log.user?.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.entity || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  const getActionBadge = (action) => {
    const base = 'px-2 py-0.5 rounded text-[9px] min-[1000px]:text-[10px] font-bold border';
    switch (action) {
      case 'CREATE':    return <span className={`${base} bg-emerald-50 text-emerald-700 border-emerald-200`}>CREATE</span>;
      case 'UPDATE':    return <span className={`${base} bg-blue-50 text-blue-700 border-blue-200`}>UPDATE</span>;
      case 'DELETE':    return <span className={`${base} bg-rose-50 text-rose-700 border-rose-200`}>DELETE</span>;
      case 'LOGIN':     return <span className={`${base} bg-amber-50 text-amber-700 border-amber-200`}>LOGIN</span>;
      case 'INTERVIEW': return <span className={`${base} bg-purple-50 text-purple-700 border-purple-200`}>INTERVIEW</span>;
      default:          return <span className={`${base} bg-slate-100 text-slate-700 border-slate-200`}>{action}</span>;
    }
  };

  const formatTime = (ts) => {
    return new Date(ts).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Audit Logs
            {/* Live indicator */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${socketConnected ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
              {socketConnected
                ? <><Wifi className="w-2.5 h-2.5" /> LIVE</>
                : <><WifiOff className="w-2.5 h-2.5" /> OFFLINE</>
              }
            </span>
            {/* New entries badge */}
            {newCount > 0 && (
              <button
                onClick={() => { setNewCount(0); }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-600 text-white animate-pulse cursor-pointer"
                title="New entries received – click to dismiss"
              >
                +{newCount} new
              </button>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-1">Track all system activity, user actions, and data changes. Updates in real-time.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="min-[1000px]:hidden flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] sm:text-xs font-bold rounded-lg sm:rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Sliders className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Filters</span>
          </button>
          <button
            onClick={fetchLogs}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] sm:text-xs font-bold rounded-lg sm:rounded-xl shadow-md shadow-indigo-100 transition duration-200 active:scale-95 cursor-pointer shrink-0"
          >
            <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${loading ? 'animate-spin' : ''}`} strokeWidth={2.5} />
            <span>Reload</span>
          </button>
        </div>
      </div>

      {/* Filters block */}
      <section className={`bg-white border border-slate-200 rounded-2xl p-3 min-[1000px]:p-5 shadow-xs grid grid-cols-2 min-[1000px]:grid-cols-3 gap-2.5 min-[1000px]:gap-4 ${showMobileFilters ? 'grid' : 'hidden min-[1000px]:grid'}`}>
        {/* Search */}
        <div className="col-span-2 min-[1000px]:col-span-2 relative">
          <label className="block text-[9px] min-[1000px]:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 min-[1000px]:mb-1.5">Search</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2.5 min-[1000px]:pl-3 flex items-center text-slate-400">
              <Search className="h-3.5 w-3.5 min-[1000px]:h-4 min-[1000px]:w-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user, entity, details..."
              className="w-full pl-8 pr-3 py-1.5 min-[1000px]:pl-9 min-[1000px]:pr-4 min-[1000px]:py-2 border border-slate-250 bg-white rounded-lg min-[1000px]:rounded-xl text-[10px] min-[1000px]:text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition"
            />
          </div>
        </div>

        {/* Action Filter */}
        <div className="col-span-2 min-[1000px]:col-span-1">
          <label className="block text-[9px] min-[1000px]:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 min-[1000px]:mb-1.5">Action Type</label>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full px-2 py-1.5 min-[1000px]:px-3 min-[1000px]:py-2 border border-slate-250 bg-white rounded-lg min-[1000px]:rounded-xl text-[10px] min-[1000px]:text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition"
          >
            <option value="ALL">All Actions</option>
            <option value="LOGIN">Login</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="INTERVIEW">Interview</option>
          </select>
        </div>
      </section>

      {/* Log list block */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
            <p className="text-xs font-semibold">Fetching audit logs...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-rose-500">
            <FileText className="h-8 w-8 text-rose-300 mb-2" />
            <p className="text-xs font-semibold">{error}</p>
            <button onClick={fetchLogs} className="mt-3 text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer">Retry</button>
          </div>
        ) : filteredLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse block min-[1000px]:table min-[1000px]:min-w-[800px]">
              <thead className="hidden min-[1000px]:table-header-group">
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 uppercase font-black tracking-wider text-[10px]">
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Action</th>
                  <th className="py-4 px-6">Entity</th>
                  <th className="py-4 px-6">Details</th>
                </tr>
              </thead>
              <tbody className="block min-[1000px]:table-row-group divide-y divide-slate-150 text-xs">
                {filteredLogs.map((log, idx) => (
                  <tr
                    key={log.id || idx}
                    className={`grid grid-cols-2 mb-1.5 min-[1000px]:mb-0 gap-1.5 p-2 min-[1000px]:gap-4 min-[1000px]:p-0 min-[1000px]:table-row hover:bg-slate-50/50 transition duration-150 ${idx === 0 && newCount > 0 ? 'bg-indigo-50/40 min-[1000px]:bg-indigo-50/40' : ''}`}
                  >
                    {/* Timestamp */}
                    <td className="col-span-2 min-[1000px]:table-cell min-[1000px]:py-4 min-[1000px]:px-6">
                      <div className="flex items-center justify-between min-[1000px]:block gap-2">
                        <p className="text-[9px] min-[1000px]:text-[10px] font-mono text-slate-500">{formatTime(log.created_at)}</p>
                        <div className="min-[1000px]:hidden">{getActionBadge(log.action)}</div>
                      </div>
                    </td>

                    {/* User */}
                    <td className="col-span-1 flex flex-col justify-center min-[1000px]:table-cell min-[1000px]:py-4 min-[1000px]:px-6">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 min-[1000px]:hidden">User</span>
                      <p className="font-extrabold text-slate-800 text-[11px] min-[1000px]:text-sm truncate">
                        {log.user ? log.user.username : <span className="text-slate-400 font-medium italic">System</span>}
                      </p>
                    </td>

                    {/* Action (desktop only) */}
                    <td className="hidden min-[1000px]:table-cell min-[1000px]:py-4 min-[1000px]:px-6">
                      {getActionBadge(log.action)}
                    </td>

                    {/* Entity */}
                    <td className="col-span-1 flex flex-col justify-center min-[1000px]:table-cell min-[1000px]:py-4 min-[1000px]:px-6">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 min-[1000px]:hidden">Entity</span>
                      <p className="font-bold text-slate-700 text-[10px] min-[1000px]:text-xs">{log.entity}</p>
                    </td>

                    {/* Details */}
                    <td className="col-span-2 min-[1000px]:table-cell min-[1000px]:py-4 min-[1000px]:px-6 border-t border-slate-100 min-[1000px]:border-none pt-1.5 min-[1000px]:pt-0">
                      <p className="text-[10px] min-[1000px]:text-xs text-slate-500 font-medium line-clamp-2 min-[1000px]:line-clamp-none">{log.details}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 border border-slate-200 border-dashed rounded-2xl m-4">
            <FileText className="h-10 w-10 text-slate-350 mx-auto mb-2" />
            <p className="text-xs font-semibold">No audit logs found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {!loading && !error && filteredLogs.length > 0 && (
        <p className="text-[10px] text-slate-400 font-semibold text-right">
          Showing {filteredLogs.length} of {logs.length} log{logs.length !== 1 ? 's' : ''}
          &nbsp;· Records auto-deleted after 30 days
        </p>
      )}
    </div>
  );
}
