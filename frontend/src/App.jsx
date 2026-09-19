import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Stakeholder Login Pages
import AdminLogin from './pages/admin/Login';
import MobilizerLogin from './pages/mobilizer/Login';
import TrainerLogin from './pages/trainer/Login';
import PlacementLogin from './pages/placement/Login';
import MELogin from './pages/me/Login';
import CandidateLogin from './pages/candidate/Login';

// Stakeholder Dashboard & Management Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import MobilizerAdmin from './pages/admin/MobilizerAdmin';
import MobilizerDashboard from './pages/mobilizer/Dashboard';
import CandidateManagement from './pages/mobilizer/CandidateManagement';
import CandidateOnboarding from './pages/mobilizer/CandidateOnboarding';
import DocumentManagement from './pages/mobilizer/DocumentManagement';
import ReadinessManagement from './pages/mobilizer/ReadinessManagement';
import TrainerDashboard from './pages/trainer/Dashboard';
import PlacementDashboard from './pages/placement/Dashboard';
import MEDashboard from './pages/me/Dashboard';
import CandidateDashboard from './pages/candidate/Dashboard';
import CandidateProfilePage from './pages/candidate/Profile';
import CandidateDocumentsPage from './pages/candidate/Documents';
import CandidateNFStatusPage from './pages/candidate/NFStatus';
import CandidateTrainingPage from './pages/candidate/Training';
import CandidateAssessmentsPage from './pages/candidate/Assessments';
import CandidateJobOffersPage from './pages/candidate/JobOffers';
import CandidateSupportPage from './pages/candidate/Support';
import CandidateNotificationsPage from './pages/candidate/Notifications';
import GenericAdminSection from './pages/admin/GenericAdminSection';
import StakeholderManagement from './pages/admin/StakeholderManagement';
import BatchManagement from './pages/admin/BatchManagement';
import BatchCreate from './pages/admin/BatchCreate';
import TrainingModules from './pages/admin/TrainingModules';
import TrainingCentres from './pages/admin/TrainingCentres';
import TrainingAttendance from './pages/admin/TrainingAttendance';
import TrainingAssessments from './pages/admin/TrainingAssessments';
import TrainingCertifications from './pages/admin/TrainingCertifications';
import MobilizerBatchView from './pages/mobilizer/MobilizerBatchView';
import BatchCalendar from './pages/trainer/BatchCalendar';
import TrainerCandidates from './pages/trainer/TrainerCandidates';
import PracticalSessions from './pages/trainer/PracticalSessions';
import TrainerFeedback from './pages/trainer/TrainerFeedback';
import TrainerReports from './pages/trainer/TrainerReports';
import TrainerNotifications from './pages/trainer/TrainerNotifications';
import TrainerSupport from './pages/trainer/TrainerSupport';
import CandidateAssessments from './pages/mobilizer/CandidateAssessments';
import CandidatePlacements from './pages/mobilizer/CandidatePlacements';
import MobilizerTargets from './pages/mobilizer/MobilizerTargets';
import MobilizerReports from './pages/mobilizer/MobilizerReports';
import EmployerManagement from './pages/placement/EmployerManagement';
import PlacementDeployments from './pages/placement/PlacementDeployments';
import HomeLanding from './pages/home/HomeLanding';

export default function App() {
  // Session State (persisted in localStorage)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('eventransparency_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Helper to extract section from hash
  const extractSectionFromHash = (hash) => {
    if (!hash) return null;
    const clean = hash.replace(/^#\/?/, '').replace(/^(admin|mobilizer|trainer|placement|me|candidate)\//, '');
    if (clean && !clean.startsWith('login') && clean !== 'landing' && clean !== 'home') {
      return clean;
    }
    return null;
  };

  // Current view: 'landing' | 'login' | 'app'
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash;
    if (hash === '#landing' || hash === '#home') return 'landing';
    if (hash.startsWith('#login') || hash.startsWith('#/login')) return 'login';

    const savedSession = localStorage.getItem('eventransparency_session');
    if (savedSession) {
      return 'app';
    }

    if (hash.startsWith('#/')) return 'login';
    return 'landing';
  });

  // Active Login Role: 'admin' | 'mobilizer' | 'trainer' | 'placement' | 'me' | 'candidate'
  const [activeLoginRole, setActiveLoginRole] = useState(() => {
    const hash = window.location.hash;
    if (hash.includes('mobilizer')) return 'mobilizer';
    if (hash.includes('trainer')) return 'trainer';
    if (hash.includes('placement')) return 'placement';
    if (hash.includes('me')) return 'me';
    if (hash.includes('candidate')) return 'candidate';
    return 'admin';
  });

  // Layout states for workspace
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  // Active section inside workspace (persisted across reloads)
  const [activeSection, setActiveSection] = useState(() => {
    const hashSection = extractSectionFromHash(window.location.hash);
    if (hashSection) return hashSection;

    const savedSection = localStorage.getItem('eventransparency_active_section');
    if (savedSection) return savedSection;

    return 'overview';
  });

  // Ensure current URL hash stays in sync with active section
  useEffect(() => {
    if (currentView === 'app' && activeSection) {
      localStorage.setItem('eventransparency_active_section', activeSection);
      if (window.location.hash !== `#/${activeSection}`) {
        window.history.replaceState(null, '', `#/${activeSection}`);
      }
    }
  }, [currentView, activeSection]);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      // 1. Auth routes
      if (hash === '#login' || hash === '#/login') {
        setCurrentView('login');
        setActiveLoginRole('admin');
      } else if (hash.startsWith('#login/') || hash.startsWith('#/login/')) {
        setCurrentView('login');
        const role = hash.replace(/^#\/?login\//, '');
        setActiveLoginRole(role || 'admin');
      } else if (hash === '#landing' || hash === '#home') {
        setCurrentView('landing');
      } else {
        const session = localStorage.getItem('eventransparency_session');
        if (session) {
          setCurrentView('app');
          const section = extractSectionFromHash(hash) || localStorage.getItem('eventransparency_active_section') || 'overview';
          setActiveSection(section);
          localStorage.setItem('eventransparency_active_section', section);
        } else if (hash.startsWith('#/')) {
          if (hash.includes('mobilizer')) setActiveLoginRole('mobilizer');
          else if (hash.includes('trainer')) setActiveLoginRole('trainer');
          else if (hash.includes('placement')) setActiveLoginRole('placement');
          else if (hash.includes('me')) setActiveLoginRole('me');
          else if (hash.includes('candidate')) setActiveLoginRole('candidate');
          else setActiveLoginRole('admin');
          setCurrentView('login');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle Login Success
  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem('eventransparency_session', JSON.stringify(userData));
    if (token) localStorage.setItem('eventransparency_token', token);
    setCurrentView('app');
    
    const targetSection = localStorage.getItem('eventransparency_active_section') || 'overview';
    setActiveSection(targetSection);
    window.location.hash = `#/${targetSection}`;
  };

  // Handle Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('eventransparency_session');
    localStorage.removeItem('eventransparency_token');
    localStorage.removeItem('eventransparency_active_section');
    setCurrentView('login');
    setActiveLoginRole('admin');
    window.location.hash = '#login/admin';
  };

  // Toggle Sidebar (Mobile vs Desktop Collapse)
  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(prev => !prev);
    } else {
      setDesktopCollapsed(prev => !prev);
    }
  };

  // Section Change inside dashboard
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    localStorage.setItem('eventransparency_active_section', sectionId);
    window.location.hash = `#/${sectionId}`;
  };

  // Switch to Public Site
  const handleGoToLanding = () => {
    setCurrentView('landing');
    window.location.hash = '#landing';
  };

  // Switch to specific Login role portal
  const handleSelectLoginRole = (roleId) => {
    setActiveLoginRole(roleId || 'admin');
    window.location.hash = `#login/${roleId || 'admin'}`;
    setCurrentView('login');
  };

  // Switch to Portal for logged-in or navigate to role login
  const handleGoToAdmin = (initialSection = 'overview', role = 'admin') => {
    if (user) {
      setActiveSection(initialSection);
      setCurrentView('app');
      window.location.hash = `#/${initialSection}`;
    } else {
      handleSelectLoginRole(role);
    }
  };

  // Switch Role View on the fly (for multi-role dashboard testing)
  const handleSwitchRole = (newRoleType, newRoleLabel) => {
    const updatedUser = {
      ...user,
      userType: newRoleType,
      role: newRoleLabel,
      full_name: `${newRoleLabel} User`,
    };
    setUser(updatedUser);
    localStorage.setItem('eventransparency_session', JSON.stringify(updatedUser));
    setActiveSection('overview');
    window.location.hash = '#/overview';
  };

  // 1. Render Public Landing View
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <HomeLanding
          onNavigate={(view) => {
            if (view === 'admin-mobilizers' || view === 'mobilizers') {
              if (user) handleGoToAdmin('mobilizers');
              else handleSelectLoginRole('mobilizer');
            } else if (view === 'user-management') {
              if (user) handleGoToAdmin('user-management');
              else handleSelectLoginRole('admin');
            } else if (view === 'login/admin' || view === 'admin') {
              handleSelectLoginRole('admin');
            } else if (view === 'login/mobilizer' || view === 'mobilizer') {
              handleSelectLoginRole('mobilizer');
            } else if (view === 'login/trainer' || view === 'trainer') {
              handleSelectLoginRole('trainer');
            } else if (view === 'login/placement' || view === 'placement') {
              handleSelectLoginRole('placement');
            } else if (view === 'login/me' || view === 'me') {
              handleSelectLoginRole('me');
            } else if (view === 'login/candidate' || view === 'candidate') {
              handleSelectLoginRole('candidate');
            } else {
              handleSelectLoginRole('admin');
            }
          }}
          onOpenDemoModal={() => handleSelectLoginRole('admin')}
        />
      </div>
    );
  }

  // 2. Render Login Views directly for the 6 Stakeholder Roles
  if (currentView === 'login' || !user) {
    if (activeLoginRole === 'mobilizer') {
      return (
        <MobilizerLogin
          onLoginSuccess={handleLoginSuccess}
          onGoToLanding={handleGoToLanding}
          onSwitchRole={handleSelectLoginRole}
        />
      );
    }

    if (activeLoginRole === 'trainer') {
      return (
        <TrainerLogin
          onLoginSuccess={handleLoginSuccess}
          onGoToLanding={handleGoToLanding}
          onSwitchRole={handleSelectLoginRole}
        />
      );
    }

    if (activeLoginRole === 'placement') {
      return (
        <PlacementLogin
          onLoginSuccess={handleLoginSuccess}
          onGoToLanding={handleGoToLanding}
          onSwitchRole={handleSelectLoginRole}
        />
      );
    }

    if (activeLoginRole === 'me') {
      return (
        <MELogin
          onLoginSuccess={handleLoginSuccess}
          onGoToLanding={handleGoToLanding}
          onSwitchRole={handleSelectLoginRole}
        />
      );
    }

    if (activeLoginRole === 'candidate') {
      return (
        <CandidateLogin
          onLoginSuccess={handleLoginSuccess}
          onGoToLanding={handleGoToLanding}
          onSwitchRole={handleSelectLoginRole}
        />
      );
    }

    // Default: Admin Login Page
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onGoToLanding={handleGoToLanding}
        onSwitchRole={handleSelectLoginRole}
      />
    );
  }

  const currentUserType = user?.userType || user?.role || 'Admin';

  // 3. Render Multi-Role Portal Layout
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-[#FF408A]/20 selection:text-[#FF408A]">
      {/* Fixed Header */}
      <Header
        user={user}
        onLogout={handleLogout}
        onToggleSidebar={handleToggleSidebar}
        onSectionChange={handleSectionChange}
        activeSection={activeSection}
        onGoToLanding={handleGoToLanding}
        onSwitchRole={handleSwitchRole}
      />

      {/* Body: Sidebar + Main Content */}
      <div className="flex flex-1 pt-16">
        {/* Collapsible Sidebar */}
        <Sidebar
          user={user}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          isOpen={sidebarOpen}
          toggleSidebar={setSidebarOpen}
          isCollapsed={desktopCollapsed}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all duration-300 ${
            desktopCollapsed ? 'md:ml-0' : 'md:ml-0'
          } p-3 sm:p-5 lg:p-6 overflow-x-hidden min-h-[calc(100vh-64px)] bg-[#FDFBFE]`}
        >
          {/* Candidate Experience: Dedicated Portal with separate pages for each candidate section */}
          {currentUserType === 'Candidate' ? (
            <>
              {(!['profile', 'documents', 'nf-status', 'training', 'my-batch', 'attendance', 'training-progress', 'assessments', 'offers', 'notifications', 'support'].includes(activeSection)) && (
                <CandidateDashboard user={user} onSectionChange={handleSectionChange} />
              )}
              {activeSection === 'profile' && (
                <CandidateProfilePage user={user} onSectionChange={handleSectionChange} />
              )}
              {activeSection === 'documents' && (
                <CandidateDocumentsPage user={user} onSectionChange={handleSectionChange} />
              )}
              {activeSection === 'nf-status' && (
                <CandidateNFStatusPage user={user} onSectionChange={handleSectionChange} />
              )}
              {(activeSection === 'training' || activeSection === 'my-batch' || activeSection === 'attendance' || activeSection === 'training-progress') && (
                <CandidateTrainingPage user={user} activeSection={activeSection} onSectionChange={handleSectionChange} />
              )}
              {activeSection === 'assessments' && (
                <CandidateAssessmentsPage user={user} onSectionChange={handleSectionChange} />
              )}
              {activeSection === 'offers' && (
                <CandidateJobOffersPage user={user} onSectionChange={handleSectionChange} />
              )}
              {activeSection === 'notifications' && (
                <CandidateNotificationsPage user={user} onSectionChange={handleSectionChange} />
              )}
              {activeSection === 'support' && (
                <CandidateSupportPage user={user} onSectionChange={handleSectionChange} />
              )}
            </>
          ) : (
            <>
              {/* A. Role-Specific Dashboards for 'overview' */}
              {activeSection === 'overview' && (
                <>
                  {currentUserType === 'Mobilizer' && <MobilizerDashboard user={user} onSectionChange={handleSectionChange} />}
                  {currentUserType === 'Trainer' && <TrainerDashboard user={user} onSectionChange={handleSectionChange} />}
                  {(currentUserType === 'PlacementCoordinator' || currentUserType === 'Placement Coordinator') && (
                    <PlacementDashboard user={user} onSectionChange={handleSectionChange} />
                  )}
                  {(currentUserType === 'ME' || currentUserType === 'M&E Team') && <MEDashboard user={user} />}
                  {currentUserType === 'Admin' && <AdminDashboard onSectionChange={handleSectionChange} user={user} />}
                </>
              )}

          {/* B. Specific Stakeholder Management Sections (Full CRUD + Dedicated Form Pages) */}
          {activeSection === 'mobilizers' && (
            <StakeholderManagement categoryKey="mobilizers" onSectionChange={handleSectionChange} />
          )}

          {activeSection === 'trainers' && (
            <StakeholderManagement categoryKey="trainers" onSectionChange={handleSectionChange} />
          )}

          {activeSection === 'placement-coordinators' && (
            <StakeholderManagement categoryKey="placement-coordinators" onSectionChange={handleSectionChange} />
          )}

          {activeSection === 'partners' && (
            <StakeholderManagement categoryKey="partners" onSectionChange={handleSectionChange} />
          )}

          {activeSection === 'employers' && (
            (currentUserType === 'PlacementCoordinator' || currentUserType === 'Placement Coordinator') ? (
              <EmployerManagement placementUser={user} onSectionChange={handleSectionChange} initialTab="employers" />
            ) : (
              <StakeholderManagement categoryKey="employers" onSectionChange={handleSectionChange} />
            )
          )}

          {activeSection === 'openings' && (
            <EmployerManagement placementUser={user} onSectionChange={handleSectionChange} initialTab="roles" />
          )}

          {activeSection === 'user-management' && (
            <StakeholderManagement categoryKey="user-management" onSectionChange={handleSectionChange} />
          )}

          {/* C. Candidate Lifecycle Management Sections */}
          {activeSection === 'candidates' && (
            currentUserType === 'Trainer' ? (
              <TrainerCandidates user={user} onSectionChange={handleSectionChange} />
            ) : (
              <CandidateManagement
                mobilizerUser={user}
                onNavigateToOnboard={() => handleSectionChange('onboard-candidate')}
              />
            )
          )}

          {(activeSection === 'onboard-candidate' || activeSection === 'candidate-onboarding') && (
            <CandidateOnboarding
              mobilizerUser={user}
              onBackToRoster={() => handleSectionChange('candidates')}
              onCandidateCreated={() => handleSectionChange('candidates')}
            />
          )}

          {(activeSection === 'documents' || activeSection === 'document-verification') && (
            <DocumentManagement
              mobilizerUser={user}
              onSectionChange={handleSectionChange}
            />
          )}

          {/* C. Candidate Readiness (Mobilizer flow) */}
          {activeSection === 'readiness' && (
            <ReadinessManagement
              mobilizerUser={user}
              onSectionChange={handleSectionChange}
            />
          )}

          {/* D. Training Management Suite */}
          {activeSection === 'training-modules' && (
            <TrainingModules onSectionChange={handleSectionChange} />
          )}

          {(activeSection === 'training' || activeSection === 'batches' || activeSection === 'training-batches') && (
            <>
              {currentUserType === 'Mobilizer' ? (
                <MobilizerBatchView mobilizerUser={user} />
              ) : (
                <BatchManagement user={user} onSectionChange={handleSectionChange} />
              )}
            </>
          )}

          {(activeSection === 'batch-create' || activeSection === 'create-batch') && (
            <BatchCreate
              onBack={() => handleSectionChange('training')}
              onBatchCreated={() => handleSectionChange('training')}
            />
          )}

          {activeSection === 'training-centres' && (
            <TrainingCentres onSectionChange={handleSectionChange} />
          )}

          {(activeSection === 'batch-calendar' || activeSection === 'calendar' || activeSection === 'timetable') && (
            <BatchCalendar user={user} onSectionChange={handleSectionChange} />
          )}

          {activeSection === 'attendance' && (
            <TrainingAttendance user={user} onSectionChange={handleSectionChange} />
          )}

          {activeSection === 'assessments' && (
            <>
              {currentUserType === 'Mobilizer' ? (
                <CandidateAssessments
                  mobilizerUser={user}
                  onSectionChange={handleSectionChange}
                />
              ) : (
                <TrainingAssessments user={user} onSectionChange={handleSectionChange} />
              )}
            </>
          )}

          {(activeSection === 'deployments' || activeSection === 'placements') && currentUserType === 'Mobilizer' && (
            <CandidatePlacements
              mobilizerUser={user}
              onSectionChange={handleSectionChange}
            />
          )}

          {(activeSection === 'deployments' || activeSection === 'placements') && (currentUserType === 'PlacementCoordinator' || currentUserType === 'Placement Coordinator') && (
            <PlacementDeployments
              placementUser={user}
              onSectionChange={handleSectionChange}
            />
          )}

          {(activeSection === 'targets' || activeSection === 'goals') && (
            <MobilizerTargets
              mobilizerUser={user}
              onSectionChange={handleSectionChange}
            />
          )}

          {activeSection === 'practical-sessions' && (
            <PracticalSessions user={user} onSectionChange={handleSectionChange} />
          )}

          {activeSection === 'feedback' && (
            <TrainerFeedback user={user} onSectionChange={handleSectionChange} />
          )}

          {activeSection === 'reports' && currentUserType === 'Trainer' && (
            <TrainerReports user={user} onSectionChange={handleSectionChange} />
          )}

          {activeSection === 'reports' && currentUserType === 'Mobilizer' && (
            <MobilizerReports user={user} onSectionChange={handleSectionChange} />
          )}

          {activeSection === 'notifications' && currentUserType === 'Trainer' && (
            <TrainerNotifications user={user} onSectionChange={handleSectionChange} />
          )}

          {activeSection === 'support' && currentUserType === 'Trainer' && (
            <TrainerSupport user={user} onSectionChange={handleSectionChange} />
          )}

          {activeSection === 'certifications' && (
            <TrainingCertifications onSectionChange={handleSectionChange} />
          )}

          {/* E. Other Super Admin Sections (Deployments, Retention, Analytics, etc.) */}
          {activeSection !== 'overview' &&
            activeSection !== 'mobilizers' &&
            activeSection !== 'trainers' &&
            activeSection !== 'placement-coordinators' &&
            activeSection !== 'partners' &&
            activeSection !== 'employers' &&
            activeSection !== 'user-management' &&
            activeSection !== 'candidates' &&
            activeSection !== 'onboard-candidate' &&
            activeSection !== 'candidate-onboarding' &&
            activeSection !== 'documents' &&
            activeSection !== 'document-verification' &&
            activeSection !== 'readiness' &&
            activeSection !== 'training' &&
            activeSection !== 'batches' &&
            activeSection !== 'training-batches' &&
            activeSection !== 'batch-create' &&
            activeSection !== 'create-batch' &&
            activeSection !== 'training-modules' &&
            activeSection !== 'training-centres' &&
            activeSection !== 'attendance' &&
            activeSection !== 'assessments' &&
            activeSection !== 'targets' &&
            activeSection !== 'goals' &&
            activeSection !== 'openings' &&
            !((activeSection === 'deployments' || activeSection === 'placements') && currentUserType === 'Mobilizer') &&
            activeSection !== 'practical-sessions' &&
            activeSection !== 'feedback' &&
            activeSection !== 'certifications' &&
            !(activeSection === 'reports' && (currentUserType === 'Trainer' || currentUserType === 'Mobilizer')) &&
            !(activeSection === 'notifications' && currentUserType === 'Trainer') &&
            !(activeSection === 'support' && currentUserType === 'Trainer') && (
            <GenericAdminSection
              sectionId={activeSection}
              onSectionChange={handleSectionChange}
            />
          )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
