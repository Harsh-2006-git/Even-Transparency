import { useEffect, useState, useMemo } from 'react';
import {
  Scale, Search, Filter, Clock, CheckCircle2, AlertCircle,
  XCircle, X, Eye, Calendar, User, Building2, FileText, RefreshCw,
  SlidersHorizontal, Inbox
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

// Status Badges Styling
function statusBadge(status) {
  const map = {
    'Open':          'bg-blue-50 text-blue-700 border-blue-200',
    'In Review':     'bg-orange-50 text-orange-700 border-orange-200',
    'Investigating': 'bg-violet-50 text-violet-700 border-violet-200',
    'Resolved':      'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Closed':        'bg-slate-100 text-slate-600 border-slate-200',
    'Rejected':      'bg-rose-50 text-rose-700 border-rose-200',
  };
  return map[status] || 'bg-slate-100 text-slate-600 border-slate-200';
}

// Severity Levels Styling
function severityColor(s) {
  return s === 'Critical' ? 'bg-rose-100 text-rose-700 border-rose-200 font-bold'
       : s === 'High'     ? 'bg-orange-100 text-orange-700 border-orange-200 font-bold'
       : s === 'Medium'   ? 'bg-amber-100 text-amber-700 border-amber-200'
                          : 'bg-emerald-100 text-emerald-700 border-emerald-200';
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AdminGrievances({ adminUser, showToast }) {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterType, setFilterType] = useState('All');

  // Edit / Action State in Drawer
  const [newStatus, setNewStatus] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [actionSubmitting, setActionSubmitting] = useState(false);

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/grievances`, {
        headers: {
          'x-admin-id': adminUser.id,
          'Authorization': `Bearer ${adminUser.token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setGrievances(data || []);
      } else {
        const err = await res.json();
        showToast?.(err.error || 'Failed to fetch grievances.', 'error');
      }
    } catch (error) {
      console.error('Fetch grievances error:', error);
      showToast?.('Connection error. Could not retrieve grievances.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedGrievance) return;
    if (!newStatus) {
      showToast?.('Please select a status.', 'error');
      return;
    }

    setActionSubmitting(true);
    try {
      const res = await fetch(`${API}/admin/grievances/${selectedGrievance.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-id': adminUser.id,
          'Authorization': `Bearer ${adminUser.token}`
        },
        body: JSON.stringify({
          status: newStatus,
          resolution_notes: resolutionNotes
        })
      });

      if (res.ok) {
        const updated = await res.json();
        
        // Update local state lists
        setGrievances(prev => prev.map(g => g.id === updated.id ? updated : g));
        setSelectedGrievance(updated);
        showToast?.('Grievance status updated successfully!', 'success');
      } else {
        const err = await res.json();
        showToast?.(err.error || 'Failed to update status.', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast?.('Network error updating grievance status.', 'error');
    } finally {
      setActionSubmitting(false);
    }
  };

  // Open drawer and prefill its action inputs
  const openDrawer = (g) => {
    setSelectedGrievance(g);
    setNewStatus(g.status || '');
    setResolutionNotes(g.resolution_notes || '');
  };

  // Filtered grievances
  const filtered = useMemo(() => {
    return grievances.filter(g => {
      const matchesSearch = search ? (
        g.grievance_code.toLowerCase().includes(search.toLowerCase()) ||
        g.grievance_category.toLowerCase().includes(search.toLowerCase()) ||
        g.grievance_description.toLowerCase().includes(search.toLowerCase())
      ) : true;

      const matchesStatus = filterStatus === 'All' ? true : g.status === filterStatus;
      const matchesSeverity = filterSeverity === 'All' ? true : g.severity_level === filterSeverity;
      const matchesType = filterType === 'All' ? true : g.filed_by === filterType;

      return matchesSearch && matchesStatus && matchesSeverity && matchesType;
    });
  }, [grievances, search, filterStatus, filterSeverity, filterType]);

  // Metrics
  const metrics = useMemo(() => {
    return {
      total: grievances.length,
      open: grievances.filter(g => g.status === 'Open').length,
      critical: grievances.filter(g => ['critical', 'high'].includes(String(g.severity_level || '').toLowerCase())).length,
      closed: grievances.filter(g => g.status === 'Closed' || g.status === 'Resolved').length
    };
  }, [grievances]);

  return (
    <div className="space-y-6 text-left relative min-h-[calc(100vh-120px)]">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Grievance Ticket Management</h2>
          <p className="text-slate-500 font-semibold mt-1 text-xs">View, investigate, and close grievance tickets registered by candidates and employers.</p>
        </div>
        <button
          onClick={fetchGrievances}
          disabled={loading}
          className="flex items-center gap-1.5 h-9 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 transition cursor-pointer select-none disabled:opacity-50"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-450 text-[10px] font-black uppercase tracking-wider">Total Tickets</p>
            <h4 className="text-2xl font-black text-slate-800 mt-1">{metrics.total}</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-550 flex items-center justify-center">
            <Scale size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-blue-500 text-[10px] font-black uppercase tracking-wider">Open Tickets</p>
            <h4 className="text-2xl font-black text-slate-800 mt-1">{metrics.open}</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider">Critical Tickets</p>
            <h4 className="text-2xl font-black text-rose-600 mt-1">{metrics.critical}</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-650 flex items-center justify-center">
            <AlertCircle size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-wider">Resolved / Closed</p>
            <h4 className="text-2xl font-black text-slate-800 mt-1">{metrics.closed}</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* Filters Board */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets by code, category, keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-xl border border-slate-200 pl-10 pr-4 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 bg-slate-50/50"
          />
        </div>

        {/* Filter Type */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <SlidersHorizontal size={13} className="text-slate-450 shrink-0" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 bg-white outline-none cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="Candidate">Candidate Tickets</option>
            <option value="Employer">Employer Tickets</option>
          </select>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 bg-white outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Review">In Review</option>
            <option value="Investigating">Investigating</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Filter Severity */}
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 bg-white outline-none cursor-pointer"
          >
            <option value="All">All Severities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Tickets Table / List */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-2">
            <RefreshCw size={24} className="text-indigo-650 animate-spin" />
            <p className="text-xs font-bold text-slate-400">Loading tickets...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <Inbox size={40} strokeWidth={1.5} className="mb-2" />
            <p className="text-xs font-bold">No grievance tickets found matching filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Ticket Code</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Type / Filed By</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Grievance Category</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Related To</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Registered On</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {filtered.map((g) => {
                  const reporterName = g.filed_by === 'Candidate' 
                    ? g.Candidate?.full_name || 'Candidate'
                    : g.Employer?.company_name || 'Employer';

                  return (
                    <tr key={g.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-black text-slate-900">{g.grievance_code}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {g.filed_by === 'Candidate' ? (
                            <User size={13} className="text-violet-500" />
                          ) : (
                            <Building2 size={13} className="text-indigo-500" />
                          )}
                          <div>
                            <p className="font-extrabold text-slate-900">{reporterName}</p>
                            <p className="text-[10px] text-slate-400 font-bold tracking-wide mt-0.5 uppercase">{g.filed_by}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate">{g.grievance_category}</td>
                      <td className="px-6 py-4 font-bold text-slate-700">{g.related_to || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border tracking-wide uppercase ${severityColor(g.severity_level)}`}>
                          {g.severity_level}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase ${statusBadge(g.status)}`}>
                          {g.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{formatDate(g.created_at || g.createdAt)}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openDrawer(g)}
                          className="flex items-center gap-1 h-7 px-2.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg text-[10px] font-black text-slate-650 transition cursor-pointer"
                        >
                          <Eye size={11} />
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Details Drawer Overlay */}
      {selectedGrievance && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-200" onClick={() => setSelectedGrievance(null)} />
          
          {/* Drawer container form */}
          <form onSubmit={handleUpdateStatus} className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white z-210 shadow-2xl flex flex-col border-l border-slate-200 animate-slide-in overflow-hidden text-xs text-slate-700">
            {/* Drawer Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50/40 to-white shrink-0">
              <div>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase ${statusBadge(selectedGrievance.status)}`}>
                  {selectedGrievance.status}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">{selectedGrievance.grievance_code}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">{selectedGrievance.grievance_category}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGrievance(null)}
                className="w-8 h-8 rounded-full border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Scrollable Body Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Reporter Contact Info */}
              <div className="space-y-3 bg-slate-50 rounded-2xl p-4 border border-slate-150">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Reporter Details</h4>
                {selectedGrievance.filed_by === 'Candidate' ? (
                  <div className="space-y-1.5 font-semibold">
                    <p className="text-slate-800 font-extrabold flex items-center gap-1.5">
                      <User size={13} className="text-violet-500" />
                      {selectedGrievance.Candidate?.full_name || 'Candidate Name Unavailable'}
                    </p>
                    <p className="text-slate-500">Email: {selectedGrievance.Candidate?.email || '—'}</p>
                    <p className="text-slate-500">Phone: {selectedGrievance.Candidate?.mobile_number || '—'}</p>
                    {selectedGrievance.Employer && (
                      <p className="text-slate-500 font-medium">Assigned Company: {selectedGrievance.Employer.company_name}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1.5 font-semibold">
                    <p className="text-slate-800 font-extrabold flex items-center gap-1.5">
                      <Building2 size={13} className="text-indigo-500" />
                      {selectedGrievance.Employer?.company_name || 'Employer Name Unavailable'}
                    </p>
                    <p className="text-slate-500">Official Phone: {selectedGrievance.Employer?.official_phone_number || '—'}</p>
                    <p className="text-[10px] text-slate-400 italic">This ticket was filed directly by the employer company admin.</p>
                  </div>
                )}
              </div>

              {/* Ticket Info Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Grievance Description</h4>
                  <p className="bg-slate-50/50 p-4 rounded-xl border border-slate-150 leading-relaxed font-semibold text-slate-800 whitespace-pre-line select-text">
                    {selectedGrievance.grievance_description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Related To</h4>
                    <p className="mt-1.5 font-bold text-slate-800 break-words">{selectedGrievance.related_to || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Severity Priority</h4>
                    <span className={`inline-block mt-1 text-[9px] font-black px-2 py-0.5 rounded-full border uppercase ${severityColor(selectedGrievance.severity_level)}`}>
                      {selectedGrievance.severity_level}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Submitted Date</h4>
                    <p className="mt-1.5 font-bold text-slate-800 flex items-center gap-1">
                      <Calendar size={12} className="text-slate-400" />
                      {formatDate(selectedGrievance.created_at || selectedGrievance.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Supporting Evidence */}
                {selectedGrievance.evidence_urls && selectedGrievance.evidence_urls.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Supporting Evidence</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedGrievance.evidence_urls.map((url, index) => {
                        const isImage = /\.(jpg|jpeg|png|webp|gif)($|\?)/i.test(url) || url.includes('/image/upload/');
                        const fileName = url.substring(url.lastIndexOf('/') + 1).split('?')[0];

                        return (
                          <div key={index} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
                            {isImage ? (
                              <div className="h-28 bg-slate-100 flex items-center justify-center overflow-hidden border-b border-slate-200 group relative">
                                <img src={url} alt="Evidence document" className="object-cover w-full h-full" />
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-extrabold text-[9px] uppercase transition-opacity tracking-wider text-center"
                                >
                                  View Image
                                </a>
                              </div>
                            ) : (
                              <div className="h-28 bg-slate-100 flex flex-col items-center justify-center p-3 border-b border-slate-200">
                                <FileText size={28} className="text-slate-400 mb-1" />
                                <span className="text-[9px] text-slate-500 font-extrabold text-center truncate w-full px-2">{fileName}</span>
                              </div>
                            )}
                            <div className="p-2 flex items-center justify-between shrink-0 bg-white">
                              <span className="text-[9px] font-black text-slate-450 uppercase">File #{index + 1}</span>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[9px] font-black text-indigo-700 hover:text-indigo-900 transition flex items-center gap-0.5"
                              >
                                Open
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedGrievance.resolved_at && (
                  <div className="bg-emerald-50/50 border border-emerald-150 text-emerald-850 p-4 rounded-2xl">
                    <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Resolution Status</h4>
                    <p className="mt-1 font-semibold">{selectedGrievance.resolution_notes || 'Resolved without detailed notes.'}</p>
                    <p className="text-[9px] font-bold text-emerald-600 mt-2">Closed on {formatDate(selectedGrievance.resolved_at)}</p>
                  </div>
                )}
              </div>

              {/* Action Form Inputs inside Scrollable Content */}
              <div className="border-t border-slate-200 pt-6 space-y-4 text-left">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Investigate & Take Action</h4>

                {/* Status Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 pl-0.5">Select Ticket Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 px-3 font-semibold text-slate-700 outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="Open">Open</option>
                    <option value="In Review">In Review</option>
                    <option value="Investigating">Investigating</option>
                    <option value="Resolved">Resolved (Close Ticket)</option>
                    <option value="Closed">Closed (Archive Ticket)</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* Resolution Notes */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 pl-0.5">Resolution / Close Comments</label>
                  <textarea
                    placeholder="Describe details of investigation, steps taken, or reasons for closure..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className="w-full h-24 rounded-xl border border-slate-200 p-3 font-semibold text-slate-700 outline-none focus:border-indigo-500 bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Fixed Footer containing only the Submit Button */}
            <div className="border-t border-slate-200 p-6 bg-slate-50/80 shrink-0">
              <button
                type="submit"
                disabled={actionSubmitting}
                className="w-full h-10 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold text-xs transition active:scale-98 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs select-none"
              >
                {actionSubmitting && <RefreshCw size={12} className="animate-spin" />}
                Submit Action & Update Ticket
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
