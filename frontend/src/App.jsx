import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CandidateManagement from './pages/CandidateManagement';
import StaffManagement from './pages/StaffManagement';
import QuestionManagement from './pages/QuestionManagement';
import Analytics from './pages/Analytics';
import { db } from './db/indexedDB';
import { RefreshCw, Clock, AlertCircle, Check, CheckCircle, Edit, X } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

function App() {
  // Session State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('evencargo_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Connection and Sync states
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // PWA Install states
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Layout navigation states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  // Parse initial section from URL hash or default to 'overview'
  const [activeSection, setActiveSection] = useState(() => {
    const hash = window.location.hash;
    return hash.startsWith('#/') ? hash.slice(2) : 'overview';
  });

  const getSectionsForRole = (role) => {
    switch (role) {
      case 'Admin':
        return ['overview', 'candidate-management', 'register-staff', 'domain-weights', 'database-schema', 'access-privileges', 'question-management', 'analytics'];
      case 'Mobiliser':
        return ['overview', 'candidate-management', 'register-candidate', 'scoring-checksheet', 'mobilized-candidates'];
      default:
        return ['overview'];
    }
  };

  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setDesktopCollapsed(!desktopCollapsed);
    }
  };

  const handleSectionChange = (sectionId) => {
    window.location.hash = '/' + sectionId;
  };

  // Sync state with URL hash changes (navigation via sidebar links)
  useEffect(() => {
    const handleHashChange = () => {
      if (!isOnline) {
        setActiveSection('candidate-management');
        if (window.location.hash !== '#/candidate-management') {
          window.location.hash = '/candidate-management';
        }
        return;
      }

      const hash = window.location.hash;
      const section = hash.startsWith('#/') ? hash.slice(2) : 'overview';

      const role = user?.userType || 'Mobiliser';
      const allowedSections = getSectionsForRole(role);
      const targetSection = allowedSections.includes(section) ? section : 'overview';

      setActiveSection(targetSection);
    };

    if (user) {
      if (!isOnline) {
        setActiveSection('candidate-management');
        if (window.location.hash !== '#/candidate-management') {
          window.location.hash = '/candidate-management';
        }
      } else if (!window.location.hash) {
        window.location.hash = '/' + activeSection;
      }
      window.addEventListener('hashchange', handleHashChange);
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isOnline]);

  // Scroll to top when navigating to a new section (but do NOT reset hash on load)
  useEffect(() => {
    const contentBox = document.getElementById('main-content-scroll');
    if (contentBox) {
      contentBox.scrollTop = 0;
    }
  }, [activeSection]);

  // Connection health states
  const [backendStatus, setBackendStatus] = useState('checking');
  const [dbStatus, setDbStatus] = useState('checking');
  const [dbError, setDbError] = useState(null);

  // Candidate DB pipelines
  const [candidates, setCandidates] = useState([]);



  const [unsyncedCandidates, setUnsyncedCandidates] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState([]);
  const [syncFinished, setSyncFinished] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [offlineEditCandidate, setOfflineEditCandidate] = useState(null);

  // Custom Toast and Confirmation engine
  const [toasts, setToasts] = useState([]);
  const [confirmModal, setConfirmModal] = useState(null);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const showConfirm = (title, message, onConfirm) => {
    setConfirmModal({ title, message, onConfirm });
  };

  // Check backend server and db status
  const checkHealth = async () => {
    try {
      setBackendStatus('checking');
      setDbStatus('checking');
      const res = await fetch(`${API}/health`);
      if (!res.ok) throw new Error('API offline');
      const data = await res.json();
      setBackendStatus('connected');

      if (data.database && data.database.success) {
        setDbStatus('connected');
        setDbError(null);
      } else {
        setDbStatus('disconnected');
        setDbError(data.database?.message || 'Database connection error.');
      }
    } catch (err) {
      setBackendStatus('disconnected');
      setDbStatus('disconnected');
      setDbError('Cannot reach the backend Express server. Please make sure it is running.');
    }
  };

  // Fetch candidate list from DB (with background caching)
  const fetchCandidates = async () => {
    try {
      // 1. Fetch unsynced local candidates from IndexedDB
      let localCandidates = [];
      try {
        localCandidates = await db.candidates.toArray();
      } catch (dbErr) {
        console.error('Failed to retrieve candidates from IndexedDB:', dbErr);
      }
      const mappedLocal = localCandidates.map(c => ({
        ...c,
        id: c.tempId
      }));

      // 2. Fetch cached server candidates from IndexedDB cache
      let cachedCandidatesList = [];
      try {
        cachedCandidatesList = await db.candidatesCache.toArray();
      } catch (dbErr) {
        console.error('Failed to retrieve candidates cache from IndexedDB:', dbErr);
      }

      // Combine local unsynced and cached candidates for immediate UI rendering (no delay!)
      const combinedInitial = [...mappedLocal];
      cachedCandidatesList.forEach(cachedCand => {
        const exists = combinedInitial.some(c => c.phone === cachedCand.phone || c.id === cachedCand.id);
        if (!exists) {
          combinedInitial.push(cachedCand);
        }
      });

      combinedInitial.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.created_at || 0);
        const dateB = new Date(b.createdAt || b.created_at || 0);
        return dateB - dateA;
      });

      // Set initial UI state immediately
      setCandidates(combinedInitial);

      // 3. Perform background API call in parallel if online
      if (isOnline) {
        fetch(`${API}/candidates`)
          .then(async (res) => {
            if (res.ok) {
              const apiCandidates = await res.json();

              // Update IndexedDB cache in background
              db.candidatesCache.clear()
                .then(() => db.candidatesCache.bulkPut(apiCandidates))
                .catch(err => console.error('Failed to update candidate cache:', err));

              // Combine fresh API candidates with unsynced candidates
              const combinedFresh = [...mappedLocal];
              apiCandidates.forEach(apiCand => {
                const exists = combinedFresh.some(c => c.phone === apiCand.phone || c.id === apiCand.id);
                if (!exists) {
                  combinedFresh.push(apiCand);
                }
              });

              combinedFresh.sort((a, b) => {
                const dateA = new Date(a.createdAt || a.created_at || 0);
                const dateB = new Date(b.createdAt || b.created_at || 0);
                return dateB - dateA;
              });

              // Set the final fresh state
              setCandidates(combinedFresh);
            }
          })
          .catch(err => {
            console.warn('Background candidate sync fetch failed:', err);
          });
      }
    } catch (err) {
      console.error('Error combining candidate lists:', err);
    }
  };

  // Monitor real-time online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Capture PWA installation prompts
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissed = sessionStorage.getItem('evencargo_install_dismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
      showToast('Even Cargo App installed successfully!', 'success');
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User choice outcome: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  // Poll IndexedDB for unsynced candidates to keep the badge and dropdown reactive
  const fetchUnsyncedCandidates = async () => {
    try {
      const unsynced = await db.candidates.where({ synced: 0 }).toArray();
      setUnsyncedCandidates(unsynced || []);
    } catch (err) {
      console.error('Failed to retrieve offline queue:', err);
    }
  };

  useEffect(() => {
    fetchUnsyncedCandidates();
    const interval = setInterval(fetchUnsyncedCandidates, 2000);
    return () => clearInterval(interval);
  }, []);

  // Sync data to backend
  const triggerSync = async () => {
    if (unsyncedCandidates.length === 0 || isSyncing) return;

    setIsSyncing(true);
    setSyncFinished(false);
    setSyncError(null);

    // Initialize progress tracking
    const progressList = unsyncedCandidates.map(c => ({
      tempId: c.tempId,
      name: c.fullName || 'Unnamed Candidate',
      phone: c.phone,
      isAssessment: c.wcpAnswers && Object.keys(c.wcpAnswers).length > 0,
      status: 'pending' // 'pending' | 'syncing' | 'done' | 'error'
    }));
    setSyncProgress(progressList);

    try {
      // 1. Post to bulk sync API
      const res = await fetch(`${API}/candidates/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(unsyncedCandidates)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Server error occurred during sync');
      }

      const syncResult = await res.json();
      const resultsList = syncResult.results || [];

      // 2. Play sequential check-off animation
      for (let i = 0; i < progressList.length; i++) {
        const item = progressList[i];
        const itemResult = resultsList.find(r => r.tempId === item.tempId);
        
        // Mark current item as syncing
        setSyncProgress(prev => prev.map((pItem, idx) => idx === i ? { ...pItem, status: 'syncing' } : pItem));
        
        // Wait 600ms for visual transition
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Mark current item as done or error
        const nextStatus = itemResult && itemResult.status === 'success' ? 'done' : 'error';
        setSyncProgress(prev => prev.map((pItem, idx) => idx === i ? { ...pItem, status: nextStatus } : pItem));
      }

      // Delay slightly before marking sync complete
      await new Promise(resolve => setTimeout(resolve, 400));

      // 3. Clear successful ones and update failed ones in local IndexedDB
      const successIds = resultsList.filter(r => r.status === 'success').map(r => r.tempId);
      if (successIds.length > 0) {
        await db.candidates.where('tempId').anyOf(successIds).delete();
      }

      const failedItemsList = resultsList.filter(r => r.status === 'error');
      for (const fail of failedItemsList) {
        const localRecord = await db.candidates.get(fail.tempId);
        if (localRecord) {
          await db.candidates.put({
            ...localRecord,
            syncError: fail.message || 'Validation error'
          });
        }
      }

      // 4. Reload candidate directory list & local queue state
      await fetchCandidates();
      await fetchUnsyncedCandidates();

      const failedItems = resultsList.filter(r => r.status === 'error');
      if (failedItems.length > 0) {
        const detailedErrorsSummary = failedItems.map(f => {
          const matchedItem = progressList.find(p => p.tempId === f.tempId);
          const name = matchedItem ? matchedItem.name : 'Unknown Candidate';
          return `• ${name}: ${f.message || 'Validation error'}`;
        }).join('\n');

        setSyncError(`Sync completed with errors:\n${detailedErrorsSummary}`);
      } else {
        setSyncFinished(true);
      }
    } catch (err) {
      console.error('Data synchronization failed:', err);
      setSyncError(err.message || 'Synchronization failed.');
      // Mark active and pending tasks as failed
      setSyncProgress(prev => prev.map(item => item.status === 'syncing' || item.status === 'pending' ? { ...item, status: 'error' } : item));
    }
  };

  // Automatically trigger sync when back online
  useEffect(() => {
    if (isOnline && unsyncedCandidates.length > 0 && !isSyncing && !syncFinished && !syncError) {
      triggerSync();
    }
  }, [isOnline, unsyncedCandidates.length]);

  // Staff DB pipelines
  const [staffList, setStaffList] = useState([]);

  // Fetch staff list from DB
  const fetchStaff = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API}/auth/staff`, {
        headers: {
          'x-admin-id': user.id
        }
      });
      if (!res.ok) throw new Error('Failed to fetch staff.');
      const data = await res.json();
      setStaffList(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Run health check on mount
  useEffect(() => {
    checkHealth();
  }, []);

  // Fetch initial data when user becomes authenticated
  useEffect(() => {
    if (user) {
      fetchCandidates();
      if (user.userType === 'Admin') {
        fetchStaff();
      }
    }
  }, [user]);

  // Handle successful login
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('evencargo_session', JSON.stringify(userData));
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setCandidates([]);
    setStaffList([]);
    localStorage.removeItem('evencargo_session');
    window.location.hash = '';
  };

  const handleCandidateAdded = (newCandidate) => {
    setCandidates(prev => [newCandidate, ...prev]);
  };

  const handleEditOfflineCandidate = (candidate) => {
    const editPayload = {
      ...candidate,
      id: candidate.tempId
    };
    setOfflineEditCandidate(editPayload);
    setActiveSection('candidate-management');
    window.location.hash = '/candidate-management';
  };

  // If not logged in, render the secure Login gate
  if (!user) {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        deferredPrompt={deferredPrompt}
        onInstall={handleInstallApp}
      />
    );
  }

  return (
    <div className="h-dvh w-screen flex flex-col overflow-hidden bg-slate-50 text-slate-800 selection:bg-indigo-150 selection:text-indigo-900 font-sans">

      {/* Header component */}
      <Header
        user={user}
        onLogout={handleLogout}
        onToggleSidebar={handleToggleSidebar}
        isOnline={isOnline}
        unsyncedCandidates={unsyncedCandidates}
        triggerSync={triggerSync}
        onEditCandidate={handleEditOfflineCandidate}
      />

      {/* Spacer to prevent fixed header from overlapping content */}
      <div className="h-20 md:h-16 shrink-0" />

      {/* PWA Install Banner */}
      {showInstallBanner && deferredPrompt && (
        <div className="bg-gradient-to-r from-indigo-650 to-blue-600 text-white px-4 py-3 shadow-md flex items-center justify-between gap-3 text-xs shrink-0 animate-slide-in-top">
          <div className="flex items-center space-x-3 min-w-0">
            {/* Logo */}
            <div className="h-9 w-9 bg-white rounded-xl p-1 shrink-0 shadow-sm flex items-center justify-center">
              <img src="/logo.png" alt="Even Cargo Logo" className="h-7 w-7 object-contain" />
            </div>
            <div className="min-w-0">
              <h4 className="font-extrabold text-[12px] md:text-[13px] leading-tight">Install Even Cargo App</h4>
              <p className="text-[9px] md:text-[10px] text-indigo-100 font-medium mt-0.5 leading-normal truncate">
                Download the app on your device for offline candidate registration & zero-delay load times.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallApp}
              className="bg-white hover:bg-slate-100 text-indigo-750 font-extrabold px-3 py-1.5 rounded-xl transition duration-150 active:scale-95 cursor-pointer text-[10px] md:text-xs shadow-sm whitespace-nowrap"
            >
              Download App
            </button>
            <button
              onClick={() => {
                setShowInstallBanner(false);
                sessionStorage.setItem('evencargo_install_dismissed', 'true');
              }}
              className="p-1 hover:bg-white/10 rounded-lg text-indigo-150 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Grid container with sidebar and content */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Left Sidebar */}
        {isOnline && (
          <Sidebar
            user={user}
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            isOpen={sidebarOpen}
            toggleSidebar={setSidebarOpen}
            isCollapsed={desktopCollapsed}
          />
        )}

        {/* Right workspace: Main Scrollable Panel + Fixed Footer */}
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">

          {/* Scrollable content box */}
          <main
            id="main-content-scroll"
            className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scroll-smooth"
          >
            {dbError && (
              <div className="bg-amber-50 border border-amber-250 text-amber-800 rounded-2xl p-4 text-xs font-semibold">
                {dbError}
              </div>
            )}

            {/* Conditionally render pages based on active section */}
            {activeSection === 'candidate-management' ? (
              <CandidateManagement
                user={user}
                candidates={candidates}
                setCandidates={setCandidates}
                fetchCandidates={fetchCandidates}
                isOnline={isOnline}
                offlineEditCandidate={offlineEditCandidate}
                setOfflineEditCandidate={setOfflineEditCandidate}
                showToast={showToast}
                showConfirm={showConfirm}
              />
            ) : activeSection === 'register-staff' ? (
              <StaffManagement
                user={user}
                staffList={staffList}
                setStaffList={setStaffList}
                fetchStaff={fetchStaff}
                showToast={showToast}
              />
            ) : activeSection === 'question-management' ? (
              <QuestionManagement 
                showToast={showToast}
              />
            ) : activeSection === 'analytics' ? (
              <Analytics
                user={user}
              />
            ) : (
              <Dashboard
                user={user}
                candidates={candidates}
                fetchCandidates={fetchCandidates}
                onCandidateAdded={handleCandidateAdded}
                dbStatus={dbStatus}
                showToast={showToast}
              />
            )}
          </main>

          {/* Fixed Footer */}
          <footer className="hidden lg:block border-t border-slate-200 py-3.5 text-center text-[10px] text-slate-500 bg-white shrink-0 select-none shadow-xs">
            <p className="hidden lg:block">&copy; {new Date().getFullYear()} Even Cargo Logistics Recruitment Platform. All Rights Reserved.</p>
          </footer>

        </div>

      </div>

      {/* Synchronization Overlay Modal */}
      {isSyncing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl p-6 flex flex-col space-y-6 animate-scale-up text-xs">
            {/* Header */}
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 bg-indigo-50 text-indigo-650 rounded-2xl">
                <RefreshCw className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-800">Pushing Offline Queue to Cloud</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Please keep the browser open while we sync.</p>
              </div>
            </div>

            {/* Sync Progress List */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {syncProgress.map((item) => (
                <div key={item.tempId} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-slate-250 flex items-center justify-center font-bold text-slate-600 text-[10px]">
                      {item.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-800 truncate">{item.name}</div>
                      <div className="text-[9px] text-slate-400 font-semibold mt-0.5 truncate">
                        {item.isAssessment ? 'Complete 28-Question Assessment' : 'Register Candidate Profile'}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 pl-2">
                    {item.status === 'pending' && (
                      <div className="flex items-center text-slate-450 space-x-1 font-bold text-[9px] uppercase tracking-wider bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">
                        <Clock className="w-3 h-3" />
                        <span>Queued</span>
                      </div>
                    )}
                    {item.status === 'syncing' && (
                      <div className="flex items-center text-indigo-600 space-x-1 font-bold text-[9px] uppercase tracking-wider bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-lg animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Syncing</span>
                      </div>
                    )}
                    {item.status === 'done' && (
                      <div className="flex items-center text-emerald-600 space-x-1 font-bold text-[9px] uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                        <Check className="w-3 h-3 animate-scale-up" strokeWidth={3} />
                        <span>Done</span>
                      </div>
                    )}
                    {item.status === 'error' && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-rose-600 space-x-1 font-bold text-[9px] uppercase tracking-wider bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg">
                          <AlertCircle className="w-3 h-3" />
                          <span>Failed</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const cand = unsyncedCandidates.find(c => c.tempId === item.tempId);
                            if (cand) {
                              setIsSyncing(false);
                              setSyncError(null);
                              handleEditOfflineCandidate(cand);
                            }
                          }}
                          className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 border border-indigo-200 bg-white rounded-lg transition cursor-pointer shadow-xs shrink-0"
                          title="Edit Candidate Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Status Footer */}
            {syncFinished && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-xs">All Sync Operations Completed</h4>
                    <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Your offline queue was successfully pushed to PostgreSQL.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsSyncing(false);
                    setSyncFinished(false);
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition shadow-md text-center cursor-pointer"
                >
                  Dismiss & Continue
                </button>
              </div>
            )}

            {syncError && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 flex items-center space-x-3">
                  <AlertCircle className="w-8 h-8 text-rose-600 shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-xs">Sync Failed</h4>
                    <p className="text-[10px] text-rose-700 font-semibold mt-0.5">{syncError}</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={triggerSync}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-md text-center cursor-pointer"
                  >
                    Retry Sync
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSyncing(false);
                      setSyncError(null);
                    }}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 text-slate-700 transition cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 left-4 md:left-auto md:max-w-sm z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-3 md:p-4 rounded-xl md:rounded-2xl border shadow-xl flex items-start gap-2.5 md:gap-3 pointer-events-auto animate-slide-in-right transition-all duration-300 ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-250 text-emerald-800'
                : toast.type === 'error'
                  ? 'bg-rose-50 border-rose-250 text-rose-800'
                  : toast.type === 'warning'
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-rose-600 shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-amber-600 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 shrink-0 mt-0.5" />}

            <div className="flex-1 text-[11px] md:text-xs font-semibold leading-normal">
              {toast.message}
            </div>

            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-slate-400 hover:text-slate-600 transition cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Custom Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[10000] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm shadow-2xl p-6 flex flex-col items-center text-center space-y-4 animate-scale-up">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-sm text-slate-800">{confirmModal.title || 'Saved Successfully'}</h3>
              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed px-2">
                {confirmModal.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (confirmModal.onConfirm) confirmModal.onConfirm();
                setConfirmModal(null);
              }}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-md text-center cursor-pointer text-xs"
            >
              Understand & Continue
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
