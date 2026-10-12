import React from 'react';
import { ShieldAlert, ArrowLeft, LogOut, Lock, User, CheckCircle2 } from 'lucide-react';

export default function AccessDenied({
  user,
  currentUserType,
  requestedSection,
  allowedRoles = [],
  onGoToDashboard,
  onLogout
}) {
  const roleDisplayNames = {
    Admin: 'Super Admin',
    Trainer: 'Trainer / Assessor',
    Mobilizer: 'Field Mobilizer',
    PlacementCoordinator: 'Placement Officer',
    Candidate: 'Candidate'
  };

  const userRoleDisplay = roleDisplayNames[currentUserType] || currentUserType || 'User';
  const allowedRolesDisplay = allowedRoles.map(r => roleDisplayNames[r] || r).join(', ');

  const formatSectionName = (sec) => {
    if (!sec) return 'Requested Section';
    return sec
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Shield Icon Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Title & Headline */}
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-black uppercase tracking-wider border border-rose-200">
            <Lock className="w-3.5 h-3.5" />
            <span>Access Denied • Unauthorized Page</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-kaiseiTokumin tracking-tight">
            Role Permission Required
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            You do not have authorization to view this section via direct URL access.
          </p>
        </div>

        {/* Role & Access Information Box */}
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 text-left space-y-3 text-xs">
          {/* Current User Info */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Current User
              </span>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>{user?.full_name || 'Authenticated User'}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                {user?.email || 'user@evenshift.org'}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Your Role
              </span>
              <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200">
                {userRoleDisplay}
              </span>
            </div>
          </div>

          {/* Requested Section */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Requested Page:</span>
            <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
              #/{requestedSection} ({formatSectionName(requestedSection)})
            </span>
          </div>

          {/* Allowed Roles Restriction Notice */}
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-900 space-y-1">
            <div className="font-black text-[11px] uppercase tracking-wide flex items-center gap-1.5 text-amber-950">
              <span>Restricted Access</span>
            </div>
            <p className="text-[11px] font-semibold leading-relaxed">
              This page is available for <span className="font-black text-amber-950 underline">{allowedRolesDisplay}</span> users only.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onGoToDashboard}
            className="cursor-pointer w-full py-2.5 px-4 rounded-xl bg-[#F72570] hover:bg-[#de1b60] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm shadow-[#F72570]/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to My Dashboard</span>
          </button>

          <button
            onClick={onLogout}
            className="cursor-pointer w-full py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Sign In as Different Role</span>
          </button>
        </div>

      </div>
    </div>
  );
}
