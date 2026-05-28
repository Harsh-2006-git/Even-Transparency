import { LayoutDashboard } from 'lucide-react';

export default function AdminDashboard({ adminUser }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div id="overview">
        <h2 className="text-xl font-bold text-slate-800">Admin Dashboard</h2>
        <p className="text-xs font-semibold text-slate-500 mt-1">Welcome to the Even Cargo Admin Panel.</p>
      </div>

      <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
          <LayoutDashboard className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Welcome, {adminUser.full_name || adminUser.username || 'Admin'}!</h3>
        <p className="text-sm font-semibold text-slate-500 mt-2 max-w-md">
          Use the sidebar to navigate through the platform. You can manage employers, view system metrics, and control portal access from here.
        </p>
      </section>
    </div>
  );
}

