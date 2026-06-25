import { useState, useRef, useMemo } from 'react';
import {
  User, Mail, Phone, Lock, Bell, Eye, EyeOff, Shield, ShieldAlert,
  CheckCircle2, AlertTriangle, Globe, Sliders, Check, Settings,
  HelpCircle, LogOut, Laptop, Zap, Database, SlidersHorizontal,
  UserCog, Users, KeyRound, Save, Smartphone, AlertCircle,
  CheckCircle, Globe2, ShieldCheck, FileText, Sparkles, X,
  Activity, Server, BarChart3
} from 'lucide-react';

const BRAND = '#6D3BFF';
const TABS = ['Account', 'Security', 'Notifications', 'Platform', 'Privacy', 'Support'];

export default function AdminSettings({ adminUser, onUserUpdate, showToast }) {
  const [activeTab, setActiveTab] = useState('Account');

  /* ── Profile state ─────────────────────────────── */
  const [profile, setProfile] = useState({
    fullName:  adminUser?.full_name  || adminUser?.username || 'Admin User',
    email:     adminUser?.email      || 'admin@evencargo.in',
    phone:     adminUser?.mobile_number || '',
    role:      adminUser?.role       || 'Super Admin',
    portalId:  'EC-ADMIN-001',
  });
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });

  /* ── Security state ────────────────────────────── */
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [activeSessions, setActiveSessions] = useState(2);

  /* ── Notifications state ───────────────────────── */
  const [notifications, setNotifications] = useState({
    email: {
      employerApprovals:    true,
      candidateVerifications: true,
      stipendAlerts:        true,
      complianceDigest:     true,
    },
    sms: {
      systemIncidents:      true,
      criticalAlerts:       true,
      otpMessages:          true,
    },
    platform: {
      auditLogs:            true,
      newRegistrations:     false,
      reportGeneration:     true,
    },
  });

  /* ── Platform state ────────────────────────────── */
  const [platform, setPlatform] = useState({
    maintenanceMode:       false,
    autoApproveEmployers:  false,
    requireDocumentReview: true,
    twoFactorRequired:     true,
    auditLogging:          true,
    defaultLanguage:       'English',
    sessionTimeout:        '30 minutes',
  });

  /* ── Privacy state ─────────────────────────────── */
  const [privacy, setPrivacy] = useState({
    showAdminInAuditLogs:  true,
    allowDataExport:       true,
    maskSensitiveData:     false,
    receiveSystemReports:  true,
  });

  /* ── Support state ─────────────────────────────── */
  const [ticket, setTicket] = useState({ subject: '', category: 'General', message: '' });
  const [adminStatus, setAdminStatus] = useState('active');

  /* ── Toast engine ──────────────────────────────── */
  const [toasts, setToasts] = useState([]);
  const triggerToast = (message, type = 'success') => {
    if (showToast) showToast(message, type);
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  /* ── Scroll refs ───────────────────────────────── */
  const accountRef      = useRef(null);
  const securityRef     = useRef(null);
  const notifRef        = useRef(null);
  const platformRef     = useRef(null);
  const privacyRef      = useRef(null);
  const supportRef      = useRef(null);
  const refMap = {
    Account: accountRef, Security: securityRef, Notifications: notifRef,
    Platform: platformRef, Privacy: privacyRef, Support: supportRef,
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    refMap[tab]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* ── Derived ───────────────────────────────────── */
  const initials = useMemo(() => {
    const n = profile.fullName || 'Admin';
    const parts = n.trim().split(/\s+/);
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : n.slice(0, 2).toUpperCase();
  }, [profile.fullName]);

  const enabledNotifCount = [
    ...Object.values(notifications.email),
    ...Object.values(notifications.sms),
    ...Object.values(notifications.platform),
  ].filter(Boolean).length;

  /* ── Handlers ──────────────────────────────────── */
  const saveProfile = (e) => {
    e.preventDefault();
    if (!editForm.fullName.trim() || !editForm.email.includes('@')) {
      triggerToast('Enter a valid name and email.', 'error');
      return;
    }
    setProfile({ ...editForm });
    setIsEditingAccount(false);
    onUserUpdate?.({ full_name: editForm.fullName, username: editForm.fullName, email: editForm.email });
    triggerToast('Admin account settings updated.');
  };

  const updatePassword = (e) => {
    e.preventDefault();
    if (passwords.next.length < 8) { triggerToast('Minimum 8 characters required.', 'error'); return; }
    if (passwords.next !== passwords.confirm) { triggerToast('Passwords do not match.', 'error'); return; }
    setPasswords({ current: '', next: '', confirm: '' });
    triggerToast('Password updated successfully.');
  };

  const toggleNotif = (channel, key) => {
    setNotifications(prev => ({ ...prev, [channel]: { ...prev[channel], [key]: !prev[channel][key] } }));
    triggerToast('Notification preference updated.', 'info');
  };
  const togglePlatform = (key) => {
    setPlatform(prev => ({ ...prev, [key]: !prev[key] }));
    triggerToast('Platform setting updated.', 'info');
  };
  const togglePrivacy = (key) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
    triggerToast('Privacy preference updated.', 'info');
  };

  const submitTicket = (e) => {
    e.preventDefault();
    if (!ticket.subject.trim() || !ticket.message.trim()) {
      triggerToast('Subject and message are required.', 'error');
      return;
    }
    setTicket({ subject: '', category: 'General', message: '' });
    triggerToast('Support ticket raised. Team will respond shortly.');
  };

  /* ─────────────────────────────────────────────── */
  return (
    <div className="space-y-6 pb-8 text-xs">

      {/* Toast tray */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id}
            className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-2xl border text-xs font-black shadow-xl ${
              t.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
              t.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
              t.type === 'error'   ? 'bg-rose-50 border-rose-200 text-rose-800' :
              'bg-violet-50 border-violet-200 text-violet-700'
            }`}
          >
            {t.type === 'success' && <CheckCircle2 size={14} className="text-emerald-600" />}
            {t.type === 'warning' && <AlertTriangle size={14} className="text-amber-600" />}
            {t.type === 'error'   && <ShieldAlert   size={14} className="text-rose-600"  />}
            {t.type === 'info'    && <Sparkles       size={14} className="text-violet-600"/>}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Page header */}
      <div className="text-left">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Settings</h2>
        <p className="text-slate-500 font-semibold mt-1">Manage admin account, security, notifications and platform defaults.</p>
      </div>

      {/* Tab pills — identical to candidate settings */}
      <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1.5 md:pb-0">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-black border transition-all duration-200 cursor-pointer select-none ${
              activeTab === tab
                ? 'bg-[#6D3BFF] border-[#6D3BFF] text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main 2+1 grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ── Left col (2/3) ──────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Card 1: Account Settings */}
          <div ref={accountRef} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-left transition-all hover:shadow-sm scroll-mt-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 text-[#6D3BFF] flex items-center justify-center shrink-0">
                  <UserCog size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">Account Settings</h3>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Manage the admin identity used across the portal and audit logs.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { if (isEditingAccount) setEditForm({ ...profile }); setIsEditingAccount(!isEditingAccount); }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-violet-300 rounded-xl text-[10px] font-black text-slate-600 hover:text-[#6D3BFF] bg-white cursor-pointer transition select-none"
              >
                {isEditingAccount ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditingAccount ? (
              <form onSubmit={saveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name',     key: 'fullName', type: 'text'  },
                    { label: 'Email Address', key: 'email',    type: 'email' },
                    { label: 'Mobile Number', key: 'phone',    type: 'text'  },
                    { label: 'Admin Role',    key: 'role',     type: 'text'  },
                  ].map(f => (
                    <div key={f.key} className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{f.label}</label>
                      <input
                        type={f.type}
                        value={editForm[f.key]}
                        onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] transition"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" className="h-9 px-5 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Full Name</span>
                    <p className="text-xs font-black text-slate-800">{profile.fullName}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Email Address</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs font-black text-slate-800">{profile.email}</p>
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">Verified</span>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Admin Role</span>
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100 text-[9px] font-black uppercase">{profile.role}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Mobile Number</span>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-black text-slate-800">{profile.phone ? `+91 ${profile.phone}` : '—'}</p>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Portal ID</span>
                    <p className="text-xs font-black text-slate-800">{profile.portalId}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Compliance</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> NAPS Compliant
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2.5 pt-3 border-t border-slate-100">
                  <button onClick={() => setIsEditingAccount(true)}
                    className="flex items-center gap-1.5 h-8 px-3.5 border border-slate-200 hover:border-violet-300 rounded-xl text-[10px] font-black text-slate-600 hover:text-[#6D3BFF] bg-white cursor-pointer transition shadow-xs">
                    <Mail size={12} /> Change Email
                  </button>
                  <button onClick={() => setIsEditingAccount(true)}
                    className="flex items-center gap-1.5 h-8 px-3.5 border border-slate-200 hover:border-violet-300 rounded-xl text-[10px] font-black text-slate-600 hover:text-[#6D3BFF] bg-white cursor-pointer transition shadow-xs">
                    <Smartphone size={12} /> Change Mobile
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Security */}
          <div ref={securityRef} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-left transition-all hover:shadow-sm scroll-mt-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 text-[#6D3BFF] flex items-center justify-center shrink-0">
                  <Shield size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">Security</h3>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Manage your password and active admin sessions.</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {/* Info row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Password</span>
                  <p className="text-xs font-black text-slate-800">••••••••••••</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Last Login</span>
                  <p className="text-xs font-bold text-slate-800">13 Jun 2026, 12:20 PM</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Active Sessions</span>
                  <p className="text-xs font-bold text-emerald-600">{activeSessions} Active</p>
                </div>
              </div>

              {/* Change password form */}
              <form onSubmit={updatePassword} className="space-y-4 pt-3 border-t border-slate-100">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Change Password</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[['Current Password','current'],['New Password','next'],['Confirm Password','confirm']].map(([lbl, key]) => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{lbl}</label>
                      <div className="relative">
                        <input
                          type={showPwd ? 'text' : 'password'}
                          value={passwords[key]}
                          onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                          className="w-full h-10 rounded-xl border border-slate-200 px-3 pr-9 text-xs font-semibold outline-none focus:border-[#6D3BFF] transition"
                          required
                        />
                        <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer">
                          {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <button type="submit" className="h-9 px-5 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition">
                    Update Password
                  </button>
                  {activeSessions > 1 && (
                    <button type="button" onClick={() => { setActiveSessions(1); triggerToast('All other sessions have been signed out.', 'warning'); }}
                      className="text-[10px] font-black text-rose-600 hover:underline cursor-pointer">
                      Sign Out All Other Devices
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Card 3: Notifications */}
          <div ref={notifRef} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-left transition-all hover:shadow-sm scroll-mt-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 text-[#6D3BFF] flex items-center justify-center shrink-0">
                  <Bell size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">Notification Preferences</h3>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Choose which operational events you want to receive alerts for.</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-1 rounded-lg">{enabledNotifCount} enabled</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Email */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-[#6D3BFF] uppercase tracking-wider">
                  <Mail size={12} /><span>Email Alerts</span>
                </div>
                <div className="space-y-2.5 pt-1">
                  {[
                    { label: 'Employer Approvals',        key: 'employerApprovals'      },
                    { label: 'Candidate Verifications',   key: 'candidateVerifications' },
                    { label: 'Stipend & Payment Alerts',  key: 'stipendAlerts'          },
                    { label: 'Compliance Digest',         key: 'complianceDigest'       },
                  ].map(item => (
                    <button key={item.key} onClick={() => toggleNotif('email', item.key)}
                      className="flex items-center gap-2.5 text-left text-slate-600 font-bold hover:text-slate-900 cursor-pointer select-none group w-full">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                        notifications.email[item.key] ? 'bg-[#6D3BFF] border-[#6D3BFF] text-white' : 'border-slate-300 bg-white group-hover:border-violet-400'
                      }`}>
                        {notifications.email[item.key] && <Check size={10} strokeWidth={4} />}
                      </div>
                      <span className="text-[11px] leading-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SMS */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-[#6D3BFF] uppercase tracking-wider">
                  <Smartphone size={12} /><span>SMS Alerts</span>
                </div>
                <div className="space-y-2.5 pt-1">
                  {[
                    { label: 'System Incidents',    key: 'systemIncidents' },
                    { label: 'Critical Alerts',     key: 'criticalAlerts'  },
                    { label: 'OTP Messages',        key: 'otpMessages'     },
                  ].map(item => (
                    <button key={item.key} onClick={() => toggleNotif('sms', item.key)}
                      className="flex items-center gap-2.5 text-left text-slate-600 font-bold hover:text-slate-900 cursor-pointer select-none group w-full">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                        notifications.sms[item.key] ? 'bg-[#6D3BFF] border-[#6D3BFF] text-white' : 'border-slate-300 bg-white group-hover:border-violet-400'
                      }`}>
                        {notifications.sms[item.key] && <Check size={10} strokeWidth={4} />}
                      </div>
                      <span className="text-[11px] leading-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-[#6D3BFF] uppercase tracking-wider">
                  <Server size={12} /><span>Platform Events</span>
                </div>
                <div className="space-y-2.5 pt-1">
                  {[
                    { label: 'Audit Log Activity',   key: 'auditLogs'          },
                    { label: 'New Registrations',    key: 'newRegistrations'   },
                    { label: 'Report Generation',    key: 'reportGeneration'   },
                  ].map(item => (
                    <button key={item.key} onClick={() => toggleNotif('platform', item.key)}
                      className="flex items-center gap-2.5 text-left text-slate-600 font-bold hover:text-slate-900 cursor-pointer select-none group w-full">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                        notifications.platform[item.key] ? 'bg-[#6D3BFF] border-[#6D3BFF] text-white' : 'border-slate-300 bg-white group-hover:border-violet-400'
                      }`}>
                        {notifications.platform[item.key] && <Check size={10} strokeWidth={4} />}
                      </div>
                      <span className="text-[11px] leading-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Platform Defaults */}
          <div ref={platformRef} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-left transition-all hover:shadow-sm scroll-mt-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 text-[#6D3BFF] flex items-center justify-center shrink-0">
                  <SlidersHorizontal size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">Platform Defaults</h3>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Tune workflow defaults across the admin console.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Maintenance Mode',           key: 'maintenanceMode',       detail: 'Temporarily pause non-admin access during platform work.',               danger: true  },
                { label: 'Auto-Approve Employers',     key: 'autoApproveEmployers',  detail: 'Allow trusted registrations to bypass manual review.',                    danger: false },
                { label: 'Require Document Review',    key: 'requireDocumentReview', detail: 'Keep manual document review mandatory before candidate approval.',         danger: false },
                { label: 'Two-Factor Authentication',  key: 'twoFactorRequired',     detail: 'Enforce 2FA for all admin logins.',                                        danger: false },
                { label: 'Audit Logging',              key: 'auditLogging',          detail: 'Record all admin actions to the system audit trail.',                      danger: false },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div>
                    <p className={`font-black ${item.danger && platform[item.key] ? 'text-rose-700' : 'text-slate-800'}`}>{item.label}</p>
                    <p className="text-[10px] font-semibold text-slate-500 mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePlatform(item.key)}
                    className={`relative h-6 w-11 rounded-full transition cursor-pointer shrink-0 ${
                      platform[item.key] ? (item.danger ? 'bg-rose-600' : 'bg-[#6D3BFF]') : 'bg-slate-300'
                    }`}
                    aria-pressed={platform[item.key]}
                  >
                    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${platform[item.key] ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              ))}

              {/* Language & Timeout selects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {[
                  { label: 'Default Language', icon: Globe2,  key: 'defaultLanguage', opts: ['English','Hindi','Kannada','Tamil']                         },
                  { label: 'Session Timeout',  icon: Laptop,  key: 'sessionTimeout',  opts: ['15 minutes','30 minutes','1 hour','4 hours']                },
                ].map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.key} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#6D3BFF]" />
                        <p className="font-black text-slate-800">{s.label}</p>
                      </div>
                      <select
                        value={platform[s.key]}
                        onChange={e => { setPlatform(p => ({ ...p, [s.key]: e.target.value })); triggerToast(`${s.label} updated.`); }}
                        className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none focus:border-[#6D3BFF] cursor-pointer"
                      >
                        {s.opts.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 5: Privacy & Data */}
          <div ref={privacyRef} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-left transition-all hover:shadow-sm scroll-mt-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 text-[#6D3BFF] flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">Privacy & Data</h3>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Manage admin data preferences and access visibility.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-4">
              {[
                { label: 'Show admin name in audit logs',     key: 'showAdminInAuditLogs'  },
                { label: 'Allow platform data export',        key: 'allowDataExport'        },
                { label: 'Mask sensitive candidate data',     key: 'maskSensitiveData'      },
                { label: 'Receive system health reports',     key: 'receiveSystemReports'   },
              ].map(item => (
                <button key={item.key} onClick={() => togglePrivacy(item.key)}
                  className="flex items-center gap-2.5 text-slate-600 font-bold hover:text-slate-900 cursor-pointer select-none group shrink-0">
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                    privacy[item.key] ? 'bg-[#6D3BFF] border-[#6D3BFF] text-white' : 'border-slate-300 bg-white group-hover:border-violet-400'
                  }`}>
                    {privacy[item.key] && <Check size={10} strokeWidth={4} />}
                  </div>
                  <span className="text-[11px]">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card 6: Support */}
          <div ref={supportRef} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-left transition-all hover:shadow-sm scroll-mt-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 text-[#6D3BFF] flex items-center justify-center shrink-0">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">Support</h3>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Raise a support ticket or get help from the EvenCargo team.</p>
                </div>
              </div>
            </div>

            <form onSubmit={submitTicket} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Subject</label>
                  <input
                    type="text"
                    value={ticket.subject}
                    onChange={e => setTicket(t => ({ ...t, subject: e.target.value }))}
                    placeholder="Brief description of the issue"
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category</label>
                  <select
                    value={ticket.category}
                    onChange={e => setTicket(t => ({ ...t, category: e.target.value }))}
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] cursor-pointer transition"
                  >
                    {['General','Technical Issue','Billing','Compliance','Feature Request'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Message</label>
                <textarea
                  value={ticket.message}
                  onChange={e => setTicket(t => ({ ...t, message: e.target.value }))}
                  rows={4}
                  placeholder="Describe the issue in detail..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] transition resize-none"
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="h-9 px-5 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition">
                  Raise Support Ticket
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* ── Right sidebar (sticky) ──────────────── */}
        <div className="space-y-5 lg:sticky lg:top-4">

          {/* Admin profile card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
              <div className="w-12 h-12 rounded-full text-white flex items-center justify-center font-black text-sm shadow-md shrink-0"
                style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D3BFF 50%, #A855F7 100%)' }}>
                {initials}
              </div>
              <div className="min-w-0">
                <p className="font-black text-slate-900 text-xs truncate">{profile.fullName}</p>
                <p className="text-[10px] font-semibold text-slate-500 truncate">{profile.email}</p>
                <span className="inline-flex mt-1 px-2 py-0.5 rounded-full bg-violet-50 text-[#6D3BFF] border border-violet-100 text-[9px] font-black uppercase">{profile.role}</span>
              </div>
            </div>

            {/* Admin status options */}
            <div className="space-y-2.5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Admin Status</p>
              {[
                { id: 'active',   label: 'Active & Available',     desc: 'Actively managing the platform',    dot: 'bg-emerald-500', activeBorder: 'border-emerald-500 bg-emerald-50/20' },
                { id: 'away',     label: 'Away – Delegated Mode',  desc: 'Tasks delegated to Ops Admin',      dot: 'bg-amber-500',   activeBorder: 'border-amber-500 bg-amber-50/20'    },
                { id: 'readonly', label: 'Read-Only Mode',         desc: 'No write actions until re-enabled', dot: 'bg-slate-400',   activeBorder: 'border-slate-400 bg-slate-50'       },
              ].map(opt => {
                const isSel = adminStatus === opt.id;
                return (
                  <button key={opt.id}
                    onClick={() => { setAdminStatus(opt.id); triggerToast(`Status set to: ${opt.label}`); }}
                    className={`w-full text-left p-3 rounded-2xl border transition duration-200 cursor-pointer flex items-start gap-3 select-none ${
                      isSel ? opt.activeBorder : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${opt.dot}`} />
                    <div>
                      <p className="text-[11px] font-black text-slate-800 leading-none">{opt.label}</p>
                      <p className="text-[9px] font-semibold text-slate-500 mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick stats sidebar cards */}
          {[
            { Icon: Bell,     label: 'Notifications',    value: `${enabledNotifCount} enabled`                          },
            { Icon: Server,   label: 'Platform State',   value: platform.maintenanceMode ? '⚠️ Maintenance' : '✅ Live'  },
            { Icon: Smartphone, label: 'Mobile',         value: profile.phone ? `+91 ${profile.phone}` : 'Not added'    },
            { Icon: Activity, label: 'Active Sessions',  value: `${activeSessions} session${activeSessions > 1 ? 's' : ''}` },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xs flex items-center gap-3 transition hover:shadow-sm">
              <div className="w-9 h-9 rounded-2xl bg-violet-50 text-[#6D3BFF] flex items-center justify-center shrink-0">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-xs font-black text-slate-800 mt-0.5">{value}</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />
            </div>
          ))}

          {/* Warning card */}
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="font-black text-xs">Admin changes are sensitive</p>
                <p className="text-[10px] font-semibold mt-1 leading-relaxed">Platform settings affect all users. Review changes before saving.</p>
              </div>
            </div>
          </div>

          {/* Access Controls mini table */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-violet-50 text-[#6D3BFF] flex items-center justify-center shrink-0">
                <Users size={14} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-800">Access Controls</p>
                <p className="text-[9px] font-semibold text-slate-400">Role capabilities overview</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { role: 'Super Admin',      badge: 'bg-violet-100 text-violet-700',  cap: 'Full platform access'   },
                { role: 'Ops Admin',        badge: 'bg-blue-100 text-blue-700',      cap: 'Employers & candidates' },
                { role: 'Support Admin',    badge: 'bg-slate-100 text-slate-700',    cap: 'View-only access'       },
              ].map(r => (
                <div key={r.role} className="flex items-center justify-between gap-2 py-2 border-b border-slate-100 last:border-0">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${r.badge}`}>{r.role}</span>
                  <span className="text-[10px] font-semibold text-slate-500">{r.cap}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
