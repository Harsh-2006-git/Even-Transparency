import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

// Auth
import LoginPage from './pages/auth/LoginPage';

// Layouts
import CandidateLayout from './components/layout/CandidateLayout';

// Candidate pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import JobListingsPage from './pages/candidate/JobListingsPage';

// Lazy-loaded pages (loaded on demand to keep initial bundle small)
import { lazy, Suspense } from 'react';

const CandidateProfile     = lazy(() => import('./pages/candidate/CandidateProfile'));
const CandidateApplications = lazy(() => import('./pages/candidate/CandidateApplications'));
const NotificationsPage    = lazy(() => import('./pages/candidate/NotificationsPage'));
const JobDetailPage        = lazy(() => import('./pages/candidate/JobDetailPage'));
const ContractPage         = lazy(() => import('./pages/candidate/ContractPage'));
const StipendPage          = lazy(() => import('./pages/candidate/StipendPage'));
const CandidateOnboarding  = lazy(() => import('./pages/candidate/CandidateOnboarding'));
const GrievancePage        = lazy(() => import('./pages/candidate/GrievancePage'));

const EmployerLayout       = lazy(() => import('./components/layout/EmployerLayout'));
const EmployerDashboard    = lazy(() => import('./pages/employer/EmployerDashboard'));
const EmployerOnboarding   = lazy(() => import('./pages/employer/EmployerOnboarding'));
const PostJobPage          = lazy(() => import('./pages/employer/PostJobPage'));
const EmployerApplications = lazy(() => import('./pages/employer/EmployerApplications'));
const EmployerAttendance   = lazy(() => import('./pages/employer/EmployerAttendance'));

const AdminLayout          = lazy(() => import('./components/layout/AdminLayout'));
const AdminDashboard       = lazy(() => import('./pages/admin/AdminDashboard'));
const CandidateVerification = lazy(() => import('./pages/admin/CandidateVerification'));
const EmployerVerification = lazy(() => import('./pages/admin/EmployerVerification'));
const JobApprovals         = lazy(() => import('./pages/admin/JobApprovals'));
const AdminGrievances      = lazy(() => import('./pages/admin/AdminGrievances'));
const NAPSTracker          = lazy(() => import('./pages/admin/NAPSTracker'));
const StipendApproval      = lazy(() => import('./pages/admin/StipendApproval'));

// ─── Query client ──────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,   // 2 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ─── Loading fallback ─────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 rounded-full border-2 border-coral-500 border-t-transparent animate-spin" />
    </div>
  );
}

// ─── Auth guards ──────────────────────────────────────────
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const roleHome = {
      candidate: '/candidate/dashboard',
      employer: '/employer/dashboard',
      admin: '/admin/dashboard',
      superadmin: '/admin/dashboard',
    };
    return <Navigate to={roleHome[user?.role] || '/login'} replace />;
  }

  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return children;

  const roleHome = {
    candidate: '/candidate/dashboard',
    employer: '/employer/dashboard',
    admin: '/admin/dashboard',
    superadmin: '/admin/dashboard',
  };
  return <Navigate to={roleHome[user?.role] || '/'} replace />;
}

// ─── Main App ─────────────────────────────────────────────
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>

            {/* Public */}
            <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* ── Candidate ───────────────────────────────── */}
            <Route
              path="/candidate"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <CandidateLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard"     element={<CandidateDashboard />} />
              <Route path="onboarding"    element={<CandidateOnboarding />} />
              <Route path="jobs"          element={<JobListingsPage />} />
              <Route path="jobs/:id"      element={<JobDetailPage />} />
              <Route path="applications"  element={<CandidateApplications />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile"       element={<CandidateProfile />} />
              <Route path="contracts/:id" element={<ContractPage />} />
              <Route path="stipends"      element={<StipendPage />} />
              <Route path="grievances"    element={<GrievancePage />} />
            </Route>

            {/* ── Employer ────────────────────────────────── */}
            <Route
              path="/employer"
              element={
                <ProtectedRoute allowedRoles={['employer']}>
                  <Suspense fallback={<PageLoader />}><EmployerLayout /></Suspense>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard"    element={<EmployerDashboard />} />
              <Route path="onboarding"   element={<EmployerOnboarding />} />
              <Route path="post-job"     element={<PostJobPage />} />
              <Route path="applications" element={<EmployerApplications />} />
              <Route path="attendance"   element={<EmployerAttendance />} />
            </Route>

            {/* ── Admin ───────────────────────────────────── */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <Suspense fallback={<PageLoader />}><AdminLayout /></Suspense>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard"    element={<AdminDashboard />} />
              <Route path="candidates"   element={<CandidateVerification />} />
              <Route path="employers"    element={<EmployerVerification />} />
              <Route path="jobs"         element={<JobApprovals />} />
              <Route path="grievances"   element={<AdminGrievances />} />
              <Route path="naps"         element={<NAPSTracker />} />
              <Route path="stipends"     element={<StipendApproval />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#142952',
              color: '#F8FAFC',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: '12px',
              fontSize: '13px',
              padding: '10px 16px',
            },
            success: { iconTheme: { primary: '#5BB584', secondary: '#142952' } },
            error:   { iconTheme: { primary: '#FF5A45', secondary: '#142952' } },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
