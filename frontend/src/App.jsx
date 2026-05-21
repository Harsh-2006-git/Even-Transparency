import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CandidateManagement from './pages/CandidateManagement';

function App() {
  // Session State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('evencargo_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Layout navigation states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setDesktopCollapsed(!desktopCollapsed);
    }
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Reset navigation when user switches roles
  useEffect(() => {
    setActiveSection('overview');
    const contentBox = document.getElementById('main-content-scroll');
    if (contentBox) {
      contentBox.scrollTop = 0;
    }
  }, [user]);

  // Connection health states
  const [backendStatus, setBackendStatus] = useState('checking');
  const [dbStatus, setDbStatus] = useState('checking');
  const [dbError, setDbError] = useState(null);

  // Candidate DB pipelines
  const [candidates, setCandidates] = useState([]);

  // Check backend server and db status
  const checkHealth = async () => {
    try {
      setBackendStatus('checking');
      setDbStatus('checking');
      const res = await fetch('http://localhost:5000/api/health');
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

  // Fetch candidate list from DB
  const fetchCandidates = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/candidates');
      if (!res.ok) throw new Error('Failed to load candidate list.');
      const data = await res.json();
      setCandidates(data || []);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Run health check on mount
  useEffect(() => {
    checkHealth();
  }, []);

  // Fetch candidates when user becomes authenticated
  useEffect(() => {
    if (user) {
      fetchCandidates();
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
    localStorage.removeItem('evencargo_session');
  };

  const handleCandidateAdded = (newCandidate) => {
    setCandidates(prev => [newCandidate, ...prev]);
  };

  // If not logged in, render the secure Login gate
  if (!user) {
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess} 
      />
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-50 text-slate-800 selection:bg-indigo-150 selection:text-indigo-900 font-sans">
      
      {/* Header component */}
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Grid container with sidebar and content */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Sidebar */}
        <Sidebar 
          user={user}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          isOpen={sidebarOpen}
          toggleSidebar={setSidebarOpen}
          isCollapsed={desktopCollapsed}
        />

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

            {/* Conditionally render Candidate Directory CRUD or Dashboard */}
            {activeSection === 'candidate-management' ? (
              <CandidateManagement 
                user={user}
                candidates={candidates}
                fetchCandidates={fetchCandidates}
              />
            ) : (
              <Dashboard 
                user={user}
                candidates={candidates}
                fetchCandidates={fetchCandidates}
                onCandidateAdded={handleCandidateAdded}
                dbStatus={dbStatus}
              />
            )}
          </main>

          {/* Fixed Footer */}
          <footer className="border-t border-slate-200 py-3.5 text-center text-[10px] text-slate-500 bg-white shrink-0 select-none shadow-xs">
            <p>&copy; 2026 Even Cargo Logistics Recruitment Platform. All Rights Reserved.</p>
          </footer>

        </div>

      </div>

    </div>
  );
}

export default App;
