import { useMemo } from 'react';
import { ArrowRight, Award, BadgeCheck, Briefcase, ClipboardList, ShieldAlert, UserCircle2 } from 'lucide-react';

export default function CandidateDashboard({ user }) {
  const pct = Number(user?.candidate?.profile_completion_percentage || user?.profile_completion_percentage || 0);
  const breakdown = user?.candidate?.profile_completion_breakdown || user?.profile_completion_breakdown || {};

  const nextStep = useMemo(() => {
    const steps = [
      { key: 'basicInfo', label: 'Basic information' },
      { key: 'address', label: 'Address' },
      { key: 'education', label: 'Education' },
      { key: 'documents', label: 'Documents' },
      { key: 'bankAccount', label: 'Bank account' },
      { key: 'skills', label: 'Skills' }
    ];
    return steps.find((step) => !breakdown[step.key]);
  }, [breakdown]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <UserCircle2 className="w-6 h-6 text-violet-600" />
          <h2 className="text-2xl font-bold text-slate-850">Candidate Dashboard</h2>
        </div>
        <p className="text-sm font-semibold text-slate-500">Track your profile, readiness, and next actions.</p>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-violet-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Profile completion</p>
          <p className="text-3xl font-black text-violet-700 mt-2">{pct}%</p>
          <div className="mt-4 h-2 rounded-full bg-violet-50 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500" style={{ width: `${Math.min(100, pct)}%` }} />
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-3">
            {nextStep ? `Next: ${nextStep.label}` : 'Your profile is ready for review.'}
          </p>
        </div>

        <StatTile icon={Briefcase} label="Applications" value="0" tone="violet" />
        <StatTile icon={ClipboardList} label="Training records" value="0" tone="fuchsia" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InfoCard
          icon={ShieldAlert}
          title="Verification status"
          body={user?.candidate?.verification_status || user?.verification_status || 'Pending'}
        />
        <InfoCard
          icon={BadgeCheck}
          title="Availability"
          body={user?.candidate?.availability_status || user?.availability_status || 'Available'}
        />
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Profile snapshot</h3>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">Your current candidate record in the system.</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <DataRow label="Name" value={user?.full_name || user?.username || 'Not provided'} />
          <DataRow label="Email" value={user?.email || 'Not provided'} />
          <DataRow label="Mobile" value={user?.candidate?.mobile_number || user?.mobile_number || 'Not provided'} />
          <DataRow label="Language" value={user?.candidate?.preferred_language || user?.preferred_language || 'Not provided'} />
          <DataRow label="DOB" value={user?.candidate?.date_of_birth || user?.date_of_birth || 'Not provided'} />
          <DataRow label="NAPS ID" value={user?.candidate?.naps_candidate_id || user?.naps_candidate_id || 'Not provided'} />
        </div>
      </section>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, tone }) {
  const tones = {
    violet: 'bg-violet-50 text-violet-700 border-violet-100',
    fuchsia: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100'
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{label}</p>
        <p className="text-2xl font-black text-slate-800 mt-1">{value}</p>
      </div>
      <span className={`p-2.5 rounded-xl border ${tones[tone]}`}>
        <Icon className="w-5 h-5" />
      </span>
    </div>
  );
}

function InfoCard({ icon: Icon, title, body }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-start gap-3">
      <span className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
        <Icon className="w-4 h-4 text-violet-600" />
      </span>
      <div>
        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{title}</p>
        <p className="text-sm font-bold text-slate-800 mt-1">{body}</p>
      </div>
    </div>
  );
}

function DataRow({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{label}</p>
      <p className="text-xs font-semibold text-slate-700 mt-1 break-words">{value}</p>
    </div>
  );
}
