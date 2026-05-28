import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, AlertCircle, CheckCircle, Clock, Briefcase, FileText, Wallet } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';

// ─── Sub-components ────────────────────────────────────────

function ProfileCompletionCard({ profile }) {
  const pct = profile?.profileCompletionPercentage || 0;
  const navigate = useNavigate();

  const steps = [
    { key: 'basicInfo', label: 'Basic info' },
    { key: 'address', label: 'Address' },
    { key: 'education', label: 'Education' },
    { key: 'documents', label: 'Aadhaar' },
    { key: 'bankAccount', label: 'Bank account' },
    { key: 'skills', label: 'Skills' },
  ];

  const breakdown = profile?.profileCompletionBreakdown || {};
  const nextStep = steps.find(s => !breakdown[s.key]);

  if (pct >= 100) return null;

  return (
    <div className="card mb-4 cursor-pointer" onClick={() => navigate('/candidate/profile')}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-slate-400 mb-0.5">Profile completion</p>
          <p className="font-display text-2xl text-white">{pct}%</p>
        </div>
        <div className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
          pct < 40 ? 'bg-red-400/15 text-red-400' :
          pct < 70 ? 'bg-amber-400/15 text-amber-400' :
          'bg-sage-400/15 text-sage-400'
        }`}>
          {pct < 40 ? 'Incomplete' : pct < 70 ? 'Partial' : 'Almost done'}
        </div>
      </div>

      <div className="progress-bar mb-3">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>

      {nextStep && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Next: <span className="text-slate-300">{nextStep.label}</span>
          </p>
          <ChevronRight size={14} className="text-slate-500" />
        </div>
      )}
    </div>
  );
}

function VerificationBanner({ status }) {
  if (status === 'Approved') return null;

  return (
    <div className={`rounded-xl p-3.5 mb-4 flex items-start gap-3 ${
      status === 'Rejected'
        ? 'bg-red-400/10 border border-red-400/20'
        : 'bg-amber-400/10 border border-amber-400/20'
    }`}>
      <AlertCircle size={16} className={status === 'Rejected' ? 'text-red-400 mt-0.5' : 'text-amber-400 mt-0.5'} />
      <div>
        <p className={`text-xs font-medium ${status === 'Rejected' ? 'text-red-300' : 'text-amber-300'}`}>
          {status === 'Rejected' ? 'Profile needs attention' : 'Verification in progress'}
        </p>
        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
          {status === 'Rejected'
            ? 'One or more documents were rejected. Please re-upload and resubmit.'
            : 'Your documents are being reviewed. Usually takes 1–2 business days.'}
        </p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card flex-1 text-left active:scale-[0.97] transition-transform"
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${color}`}>
        <Icon size={15} />
      </div>
      <p className="font-display text-2xl text-white leading-none mb-0.5">{value}</p>
      <p className="text-2xs text-slate-500">{label}</p>
    </button>
  );
}

function ActiveContractCard({ contract }) {
  const navigate = useNavigate();
  if (!contract) return null;

  const daysLeft = Math.max(0, Math.ceil(
    (new Date(contract.expectedEndDate) - new Date()) / (1000 * 60 * 60 * 24)
  ));

  return (
    <button
      onClick={() => navigate(`/candidate/contracts/${contract._id}`)}
      className="card w-full text-left mb-4 active:scale-[0.98] transition-transform"
      style={{ background: 'linear-gradient(135deg, #142952 0%, #0F2040 100%)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="badge-active text-2xs mb-1.5 inline-flex">Active contract</span>
          <p className="font-medium text-sm text-white">{contract.tradeOrDesignation}</p>
          <p className="text-xs text-slate-400 mt-0.5">{contract.employerId?.companyName}</p>
        </div>
        <ChevronRight size={16} className="text-slate-500 mt-1" />
      </div>

      <div className="flex items-center gap-4 pt-3 border-t border-white/8">
        <div>
          <p className="text-2xs text-slate-500">Stipend</p>
          <p className="text-sm font-medium text-white">₹{contract.stipendAmount?.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-2xs text-slate-500">Days left</p>
          <p className="text-sm font-medium text-white">{daysLeft}</p>
        </div>
        <div>
          <p className="text-2xs text-slate-500">NAPS</p>
          <p className={`text-sm font-medium ${
            contract.napsFilingStatus === 'Approved' ? 'text-sage-400' : 'text-amber-400'
          }`}>{contract.napsFilingStatus}</p>
        </div>
      </div>
    </button>
  );
}

function RecentApplicationCard({ application }) {
  const navigate = useNavigate();

  const statusConfig = {
    'Applied':             { label: 'Applied', cls: 'badge-draft' },
    'Shortlisted':         { label: 'Shortlisted', cls: 'badge-pending' },
    'Interview Scheduled': { label: 'Interview', cls: 'badge-pending' },
    'Selected':            { label: 'Selected', cls: 'badge-approved' },
    'Rejected':            { label: 'Not selected', cls: 'badge-rejected' },
    'Withdrawn':           { label: 'Withdrawn', cls: 'badge-draft' },
  };

  const status = statusConfig[application.applicationStatus] || { label: application.applicationStatus, cls: 'badge-draft' };

  return (
    <button
      onClick={() => navigate('/candidate/applications')}
      className="card-hover w-full text-left flex items-center gap-3 py-3"
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.06)' }}>
        <Briefcase size={15} className="text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">
          {application.jobPostingId?.jobTitle || 'Role'}
        </p>
        <p className="text-xs text-slate-500 truncate">
          {application.employerId?.companyName}
        </p>
      </div>
      <span className={status.cls}>{status.label}</span>
    </button>
  );
}

// ─── Main Dashboard ────────────────────────────────────────
export default function CandidateDashboard() {
  const { user, profile } = useAuthStore();
  const navigate = useNavigate();

  const { data: profileData } = useQuery({
    queryKey: ['candidate-profile'],
    queryFn: () => api.get('/candidates/profile').then(r => r.data.data),
    enabled: !!user,
  });

  const { data: applicationsData } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => api.get('/candidates/applications?limit=5').then(r => r.data.data),
  });

  const { data: contractData } = useQuery({
    queryKey: ['my-contract'],
    queryFn: () => api.get('/contracts?status=Active&limit=1').then(r => r.data.data.contracts[0]),
  });

  const { data: stipendData } = useQuery({
    queryKey: ['pending-stipend'],
    queryFn: () => api.get('/stipends?paymentStatus=Pending&limit=1').then(r => r.data.data.stipends[0]),
  });

  const fullProfile = profileData || profile;
  const firstName = fullProfile?.firstName || user?.phone?.slice(-4) || 'there';
  const applications = applicationsData?.applications || [];
  const totalApps = applicationsData?.pagination?.total || 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="px-4 pt-12 pb-4">

      {/* Header */}
      <div className="mb-6 animate-fade-up">
        <p className="text-xs text-slate-500 mb-0.5">{greeting}</p>
        <h1 className="font-display text-2xl text-white">{firstName}</h1>
      </div>

      {/* Verification banner */}
      <div className="animate-fade-up delay-1">
        <VerificationBanner status={fullProfile?.verificationStatus} />
      </div>

      {/* Profile completion */}
      <div className="animate-fade-up delay-1">
        <ProfileCompletionCard profile={fullProfile} />
      </div>

      {/* Active contract */}
      {contractData && (
        <div className="animate-fade-up delay-2">
          <ActiveContractCard contract={contractData} />
        </div>
      )}

      {/* Stats row */}
      <div className="flex gap-3 mb-6 animate-fade-up delay-2">
        <StatCard
          icon={FileText}
          label="Applications"
          value={totalApps}
          color="bg-coral-500/15 text-coral-400"
          onClick={() => navigate('/candidate/applications')}
        />
        <StatCard
          icon={Briefcase}
          label="Jobs open"
          value={applicationsData?.openJobs || '—'}
          color="bg-amber-400/15 text-amber-400"
          onClick={() => navigate('/candidate/jobs')}
        />
        {stipendData && (
          <StatCard
            icon={Wallet}
            label="Stipend due"
            value={`₹${(stipendData.netPayableAmount / 1000).toFixed(1)}k`}
            color="bg-sage-400/15 text-sage-400"
            onClick={() => navigate('/candidate/stipends')}
          />
        )}
      </div>

      {/* Recent applications */}
      {applications.length > 0 && (
        <div className="animate-fade-up delay-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-slate-300">Recent applications</h2>
            <button
              onClick={() => navigate('/candidate/applications')}
              className="text-xs text-coral-400 hover:text-coral-300 transition-colors"
            >
              See all
            </button>
          </div>
          <div className="space-y-2">
            {applications.slice(0, 4).map((app, i) => (
              <div key={app._id} className={`animate-fade-up delay-${i + 3}`}>
                <RecentApplicationCard application={app} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state — no applications yet */}
      {applications.length === 0 && fullProfile?.verificationStatus === 'Approved' && (
        <div className="animate-fade-up delay-3 text-center py-10">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Briefcase size={24} className="text-slate-500" />
          </div>
          <p className="text-sm font-medium text-slate-300 mb-1">No applications yet</p>
          <p className="text-xs text-slate-500 mb-5">Browse open roles and apply today.</p>
          <button onClick={() => navigate('/candidate/jobs')} className="btn-primary px-6">
            Browse jobs
          </button>
        </div>
      )}
    </div>
  );
}
