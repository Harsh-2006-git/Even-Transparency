import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Briefcase, FileText, Bell, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

const NAV_ITEMS = [
  { to: '/candidate/dashboard', icon: Home, label: 'Home' },
  { to: '/candidate/jobs', icon: Briefcase, label: 'Jobs' },
  { to: '/candidate/applications', icon: FileText, label: 'Applied' },
  { to: '/candidate/notifications', icon: Bell, label: 'Alerts' },
  { to: '/candidate/profile', icon: User, label: 'Profile' },
];

export default function CandidateLayout() {
  const location = useLocation();

  // Unread notification count for badge
  const { data: countData } = useQuery({
    queryKey: ['unread-count'],
    queryFn: () => api.get('/notifications/unread-count').then(r => r.data.data.unreadCount),
    refetchInterval: 60000, // poll every minute
  });

  const unreadCount = countData || 0;

  return (
    <div className="flex flex-col min-h-screen min-h-dvh bg-navy-950">
      {/* Page content — scrollable area above nav */}
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom"
        style={{
          background: 'linear-gradient(to top, rgba(6,13,26,0.98) 70%, transparent)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center justify-around px-2 pt-2 pb-2 max-w-lg mx-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname.startsWith(to);
            const isBell = label === 'Alerts';

            return (
              <NavLink key={to} to={to} className={`nav-item ${isActive ? 'active' : ''}`}>
                <div className="relative">
                  <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                  {isBell && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-coral-500
                      text-white text-2xs flex items-center justify-center font-medium">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span>{label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
