import { useState, useEffect, useRef } from 'react';
import { 
  User, Mail, Phone, Lock, Bell, Eye, EyeOff, Shield, ShieldAlert, 
  CheckCircle2, AlertTriangle, Globe, Sliders, Check, Settings, 
  FileText, HelpCircle, ChevronRight, Laptop, LogOut, Trash2, 
  ArrowRight, Sparkles, X, FileCheck, CheckCircle, Smartphone,
  AlertCircle
} from 'lucide-react';

export default function CandidateSettings({ user, onSectionChange, onUserUpdate }) {
  // Local active tab state for scroll-spy / navigation
  const [activeTab, setActiveTab] = useState('Account');

  // Account details state pre-filled from user prop
  const [profile, setProfile] = useState({
    fullName: user?.full_name || user?.candidate?.full_name || 'Harsh Manmade',
    email: user?.email || user?.candidate?.email || 'harshmanmode79@gmail.com',
    mobileNumber: user?.candidate?.mobile_number || user?.mobile_number || '7367567635',
    emailVerified: true,
    mobileVerified: false
  });

  // Edit mode for account settings
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });

  // Security card state
  const [lastLogin, setLastLogin] = useState('09 June 2026, 09:20 PM');
  const [activeSessions, setActiveSessions] = useState(2);

  // Notification toggles
  const [notifications, setNotifications] = useState({
    email: {
      applicationUpdates: true,
      interviewUpdates: true,
      apprenticeshipRecommendations: true,
      documentVerification: true
    },
    sms: {
      otpMessages: true,
      interviewReminders: true,
      offerNotifications: true
    },
    whatsapp: {
      jobAlerts: true,
      interviewAlerts: true,
      joiningInstructions: true
    }
  });

  // Privacy & Consent options
  const [privacy, setPrivacy] = useState({
    allowRecruitersView: true,
    allowSearchVisibility: true,
    receiveJobRecommendations: true,
    receiveMarketing: false
  });

  // Language & Accessibility options
  const [language, setLanguage] = useState('English');
  const [accessibility, setAccessibility] = useState({
    largerText: false,
    highContrastMode: false,
    reduceMotion: false
  });

  // Right sidebar Profile Availability status
  const [availability, setAvailability] = useState('available'); // 'available', 'open', 'not_looking'

  // Ref hooks for smooth scrolling
  const accountRef = useRef(null);
  const securityRef = useRef(null);
  const notificationsRef = useRef(null);
  const privacyRef = useRef(null);
  const accessibilityRef = useRef(null);
  const supportRef = useRef(null);
  const dangerRef = useRef(null);

  // Map tab name to refs
  const refMap = {
    'Account': accountRef,
    'Security': securityRef,
    'Notifications': notificationsRef,
    'Privacy': privacyRef,
    'Availability': accessibilityRef, // Availability scrolls down to Accessibility & Right Sidebar
    'Support': supportRef,
    'Danger Zone': dangerRef
  };

  // Local Toast notification engine
  const [toasts, setToasts] = useState([]);
  const triggerToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Modal Control States
  const [modalType, setModalType] = useState(null); // 'changeEmail', 'changeMobile', 'changePassword', 'logoutSessions', 'deactivate', 'delete', 'raiseTicket'
  const [emailModalData, setEmailModalData] = useState({ newEmail: '', otp: '', step: 1 });
  const [phoneModalData, setPhoneModalData] = useState({ newPhone: '', otp: '', step: 1 });
  const [passwordModalData, setPasswordModalData] = useState({ current: '', newPass: '', confirm: '', show: false });
  const [ticketModalData, setTicketModalData] = useState({ subject: '', category: 'General', message: '' });
  const [confirmInput, setConfirmInput] = useState('');

  // Handle Tab clicks with smooth scroll
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    const targetRef = refMap[tabName];
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Save changes to local state & persist to parent app user session
  const saveAccountChanges = (e) => {
    e.preventDefault();
    if (!editForm.fullName.trim()) {
      triggerToast('Full Name cannot be empty.', 'error');
      return;
    }
    setProfile({ ...editForm });
    setIsEditingAccount(false);
    triggerToast('Account information updated successfully.');

    // If parent handler is available, sync the user session state
    if (onUserUpdate) {
      onUserUpdate({
        full_name: editForm.fullName,
        email: editForm.email,
        candidate: {
          ...(user?.candidate || {}),
          mobile_number: editForm.mobileNumber
        }
      });
    }
  };

  // OTP Verification flows
  const handleSendEmailOTP = () => {
    if (!emailModalData.newEmail.includes('@')) {
      triggerToast('Please enter a valid email address.', 'error');
      return;
    }
    setEmailModalData(prev => ({ ...prev, step: 2 }));
    triggerToast('Verification code sent to ' + emailModalData.newEmail);
  };

  const handleVerifyEmailOTP = () => {
    if (emailModalData.otp.trim().length < 4) {
      triggerToast('Please enter a valid verification code.', 'error');
      return;
    }
    setProfile(prev => ({ ...prev, email: emailModalData.newEmail, emailVerified: true }));
    setModalType(null);
    setEmailModalData({ newEmail: '', otp: '', step: 1 });
    triggerToast('Email address verified and updated.');
  };

  const handleSendMobileOTP = () => {
    if (phoneModalData.newPhone.trim().length < 10) {
      triggerToast('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }
    setPhoneModalData(prev => ({ ...prev, step: 2 }));
    triggerToast('OTP sent to +91 ' + phoneModalData.newPhone);
  };

  const handleVerifyMobileOTP = () => {
    if (phoneModalData.otp.trim().length < 4) {
      triggerToast('Please enter the 4-digit OTP.', 'error');
      return;
    }
    setProfile(prev => ({ ...prev, mobileNumber: phoneModalData.newPhone, mobileVerified: true }));
    setModalType(null);
    setPhoneModalData({ newPhone: '', otp: '', step: 1 });
    triggerToast('Mobile number verified and updated.');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordModalData.newPass.length < 6) {
      triggerToast('New password must be at least 6 characters.', 'error');
      return;
    }
    if (passwordModalData.newPass !== passwordModalData.confirm) {
      triggerToast('Passwords do not match.', 'error');
      return;
    }
    setModalType(null);
    setPasswordModalData({ current: '', newPass: '', confirm: '', show: false });
    triggerToast('Password changed successfully.');
  };

  const handleLogoutAllDevices = () => {
    setActiveSessions(1);
    setModalType(null);
    triggerToast('Successfully logged out from all other active sessions.');
  };

  const handleDeactivate = () => {
    if (confirmInput.toUpperCase() !== 'DEACTIVATE') {
      triggerToast('Please type DEACTIVATE to confirm.', 'error');
      return;
    }
    setModalType(null);
    setConfirmInput('');
    triggerToast('Your account has been deactivated. Profile visibility is paused.', 'warning');
  };

  const handleDeleteAccount = () => {
    if (confirmInput.toUpperCase() !== 'DELETE') {
      triggerToast('Please type DELETE to confirm.', 'error');
      return;
    }
    setModalType(null);
    setConfirmInput('');
    triggerToast('Your delete request has been filed. All personal data will be removed within 24 hours.');
  };

  const handleRaiseTicket = (e) => {
    e.preventDefault();
    if (!ticketModalData.subject.trim() || !ticketModalData.message.trim()) {
      triggerToast('Subject and Message details are required.', 'error');
      return;
    }
    setModalType(null);
    setTicketModalData({ subject: '', category: 'General', message: '' });
    triggerToast('Support ticket raised. Team will review and respond shortly.');
  };

  // Dynamic helper for toggling nested notification values
  const toggleNotification = (channel, key) => {
    setNotifications(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [key]: !prev[channel][key]
      }
    }));
    triggerToast('Notification preferences updated.', 'info');
  };

  const togglePrivacy = (key) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    triggerToast('Privacy preferences updated.', 'info');
  };

  const toggleAccessibility = (key) => {
    setAccessibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    triggerToast('Accessibility option toggled.', 'info');
  };

  const handleAvailabilityChange = (status) => {
    setAvailability(status);
    triggerToast(`Availability set to: ${status === 'available' ? 'Available for Apprenticeship' : status === 'open' ? 'Open to Opportunities' : 'Not Looking Currently'}`);
  };

  return (
    <div className={`space-y-6 ${accessibility.largerText ? 'text-sm' : 'text-xs'} ${accessibility.highContrastMode ? 'contrast-125 saturate-150' : ''}`}>
      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-2xl border text-xs font-black shadow-xl animate-scale-up ${
              toast.type === 'success' ? 'bg-emerald-50 border-emerald-250 text-emerald-800' :
              toast.type === 'warning' ? 'bg-amber-50 border-amber-250 text-amber-800' :
              toast.type === 'error' ? 'bg-rose-50 border-rose-250 text-rose-800' :
              'bg-violet-50 border-violet-250 text-[#6D3BFF]'
            }`}
          >
            {toast.type === 'success' && <CheckCircle size={14} className="text-emerald-600" />}
            {toast.type === 'warning' && <AlertTriangle size={14} className="text-amber-600" />}
            {toast.type === 'error' && <ShieldAlert size={14} className="text-rose-600" />}
            {toast.type === 'info' && <Sparkles size={14} className="text-[#6D3BFF]" />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Page Header */}
      <div className="text-left">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Settings</h2>
        <p className="text-slate-500 font-semibold mt-1">Manage your account, preferences and privacy settings</p>
      </div>

      {/* Horizontal Tabs Section Navigation */}
      <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1.5 md:pb-0">
        {['Account', 'Security', 'Notifications', 'Privacy', 'Availability', 'Support', 'Danger Zone'].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-black border transition-all duration-200 cursor-pointer select-none ${
                isActive 
                  ? 'bg-[#6D3BFF] border-[#6D3BFF] text-white shadow-xs' 
                  : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50/80 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left main options columns */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Account Settings */}
          <div ref={accountRef} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-left relative overflow-hidden transition-all hover:shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 text-[#6D3BFF] flex items-center justify-center shrink-0">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">Account Settings</h3>
                  <p className="text-[10px] font-semibold text-slate-450 mt-0.5">Manage your personal information and contact details.</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  if (isEditingAccount) {
                    setEditForm({ ...profile });
                  }
                  setIsEditingAccount(!isEditingAccount);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-violet-300 rounded-xl text-[10px] font-black text-slate-650 hover:text-[#6D3BFF] bg-white cursor-pointer transition select-none"
              >
                <span>{isEditingAccount ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            {isEditingAccount ? (
              <form onSubmit={saveAccountChanges} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pl-0.5">Full Name</label>
                    <input 
                      type="text" 
                      value={editForm.fullName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full h-10 rounded-xl border border-slate-250 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] transition"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pl-0.5">Email Address</label>
                    <input 
                      type="email" 
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full h-10 rounded-xl border border-slate-250 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] transition"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pl-0.5">Mobile Number</label>
                    <input 
                      type="text" 
                      value={editForm.mobileNumber}
                      onChange={(e) => setEditForm(prev => ({ ...prev, mobileNumber: e.target.value.replace(/\D/g, '').slice(0,10) }))}
                      className="w-full h-10 rounded-xl border border-slate-250 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#6D3BFF] transition"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button 
                    type="submit" 
                    className="h-9 px-5 bg-[#6D3BFF] hover:bg-[#5C2FFF] text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Full Name</span>
                    <p className="text-xs font-black text-slate-800">{profile.fullName}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Email Address</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs font-black text-slate-850">{profile.email}</p>
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase select-none ${
                        profile.emailVerified ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-250'
                      }`}>
                        {profile.emailVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Mobile Number</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs font-black text-slate-850">+91 {profile.mobileNumber}</p>
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase select-none ${
                        profile.mobileVerified ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-250'
                      }`}>
                        {profile.mobileVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2.5 pt-3 border-t border-slate-100">
                  <button 
                    onClick={() => {
                      setEmailModalData({ newEmail: '', otp: '', step: 1 });
                      setModalType('changeEmail');
                    }}
                    className="flex items-center gap-1.5 h-8 px-3.5 border border-slate-200 hover:border-violet-300 rounded-xl text-[10px] font-black text-slate-650 hover:text-[#6D3BFF] bg-white cursor-pointer transition select-none shadow-xs active:scale-95"
                  >
                    <Mail size={12} />
                    <span>Change Email</span>
                  </button>
                  <button 
                    onClick={() => {
                      setPhoneModalData({ newPhone: '', otp: '', step: 1 });
                      setModalType('changeMobile');
                    }}
                    className="flex items-center gap-1.5 h-8 px-3.5 border border-slate-200 hover:border-violet-300 rounded-xl text-[10px] font-black text-slate-650 hover:text-[#6D3BFF] bg-white cursor-pointer transition select-none shadow-xs active:scale-95"
                  >
                    <Smartphone size={12} />
                    <span>Change Mobile Number</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Security settings */}
          <div ref={securityRef} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-left relative overflow-hidden transition-all hover:shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 text-[#6D3BFF] flex items-center justify-center shrink-0">
                  <Shield size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">Security</h3>
                  <p className="text-[10px] font-semibold text-slate-450 mt-0.5">Manage your password and account security.</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setPasswordModalData({ current: '', newPass: '', confirm: '', show: false });
                  setModalType('changePassword');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-violet-300 rounded-xl text-[10px] font-black text-slate-650 hover:text-[#6D3BFF] bg-white cursor-pointer transition select-none"
              >
                <span>Edit</span>
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Password</span>
                  <p className="text-xs font-black text-slate-850">************</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Last Login</span>
                  <p className="text-xs font-bold text-slate-800">{lastLogin}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Login Activity</span>
                  <button 
                    onClick={() => triggerToast('Login Activity log: 2 logins from Indore, MP (Windows Laptop, Chrome Browser).')}
                    className="text-xs font-black text-[#6D3BFF] hover:underline cursor-pointer bg-transparent border-0 p-0"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Active Sessions</span>
                  <p className="text-xs font-bold text-emerald-600">{activeSessions} Active</p>
                </div>
              </div>

              <div className="flex gap-4 pt-1 border-t border-slate-50 items-center justify-between">
                <button 
                  onClick={() => {
                    setPasswordModalData({ current: '', newPass: '', confirm: '', show: false });
                    setModalType('changePassword');
                  }}
                  className="text-[10px] font-black text-[#6D3BFF] hover:underline cursor-pointer bg-transparent border-0 p-0"
                >
                  Change Password
                </button>
                
                {activeSessions > 1 && (
                  <button 
                    onClick={() => setModalType('logoutSessions')}
                    className="text-[10px] font-black text-rose-600 hover:text-rose-800 hover:underline cursor-pointer bg-transparent border-0 p-0"
                  >
                    Logout from All Devices
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Card 3: Notification Preferences */}
          <div ref={notificationsRef} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-left relative overflow-hidden transition-all hover:shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 text-[#6D3BFF] flex items-center justify-center shrink-0">
                  <Bell size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">Notification Preferences</h3>
                  <p className="text-[10px] font-semibold text-slate-450 mt-0.5">Choose how you want to receive updates and alerts.</p>
                </div>
              </div>
              <button 
                onClick={() => triggerToast('Select your notification preferences directly from the checkboxes.')}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-violet-300 rounded-xl text-[10px] font-black text-slate-650 hover:text-[#6D3BFF] bg-white cursor-pointer transition select-none animate-pulse"
              >
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Email Notifications Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-[#6D3BFF] uppercase tracking-wider">
                  <Mail size={12} />
                  <span>Email Notifications</span>
                </div>
                <div className="space-y-2.5 pt-1">
                  {[
                    { label: 'Application Updates', key: 'applicationUpdates' },
                    { label: 'Interview Updates', key: 'interviewUpdates' },
                    { label: 'Apprenticeship Recommendations', key: 'apprenticeshipRecommendations' },
                    { label: 'Document Verification Updates', key: 'documentVerification' }
                  ].map(item => (
                    <button
                      key={item.key}
                      onClick={() => toggleNotification('email', item.key)}
                      className="flex items-center gap-2.5 text-left text-slate-650 font-bold hover:text-slate-900 cursor-pointer select-none group w-full"
                    >
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                        notifications.email[item.key]
                          ? 'bg-[#6D3BFF] border-[#6D3BFF] text-white shadow-xs' 
                          : 'border-slate-350 bg-white group-hover:border-violet-400'
                      }`}>
                        {notifications.email[item.key] && <Check size={10} strokeWidth={4} />}
                      </div>
                      <span className="text-[11px] leading-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SMS Notifications Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-violet-650 uppercase tracking-wider">
                  <Smartphone size={12} />
                  <span>SMS Notifications</span>
                </div>
                <div className="space-y-2.5 pt-1">
                  {[
                    { label: 'OTP Messages', key: 'otpMessages' },
                    { label: 'Interview Reminders', key: 'interviewReminders' },
                    { label: 'Offer Notifications', key: 'offerNotifications' }
                  ].map(item => (
                    <button
                      key={item.key}
                      onClick={() => toggleNotification('sms', item.key)}
                      className="flex items-center gap-2.5 text-left text-slate-650 font-bold hover:text-slate-900 cursor-pointer select-none group w-full"
                    >
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                        notifications.sms[item.key]
                          ? 'bg-[#6D3BFF] border-[#6D3BFF] text-white shadow-xs' 
                          : 'border-slate-350 bg-white group-hover:border-violet-400'
                      }`}>
                        {notifications.sms[item.key] && <Check size={10} strokeWidth={4} />}
                      </div>
                      <span className="text-[11px] leading-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* WhatsApp Notifications Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-[#6D3BFF] uppercase tracking-wider">
                  <Globe size={12} />
                  <span>WhatsApp Notifications</span>
                </div>
                <div className="space-y-2.5 pt-1">
                  {[
                    { label: 'Job Alerts', key: 'jobAlerts' },
                    { label: 'Interview Alerts', key: 'interviewAlerts' },
                    { label: 'Joining Instructions', key: 'joiningInstructions' }
                  ].map(item => (
                    <button
                      key={item.key}
                      onClick={() => toggleNotification('whatsapp', item.key)}
                      className="flex items-center gap-2.5 text-left text-slate-650 font-bold hover:text-slate-900 cursor-pointer select-none group w-full"
                    >
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                        notifications.whatsapp[item.key]
                          ? 'bg-[#6D3BFF] border-[#6D3BFF] text-white shadow-xs' 
                          : 'border-slate-350 bg-white group-hover:border-violet-400'
                      }`}>
                        {notifications.whatsapp[item.key] && <Check size={10} strokeWidth={4} />}
                      </div>
                      <span className="text-[11px] leading-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Card 4: Privacy & Consent */}
          <div ref={privacyRef} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-left relative overflow-hidden transition-all hover:shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 text-[#6D3BFF] flex items-center justify-center shrink-0">
                  <ShieldCheckIcon size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">Privacy & Consent</h3>
                  <p className="text-[10px] font-semibold text-slate-450 mt-0.5">Manage your privacy preferences and data sharing.</p>
                </div>
              </div>
              <button 
                onClick={() => triggerToast('Change permissions below to update visibility details.')}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-violet-300 rounded-xl text-[10px] font-black text-slate-650 hover:text-[#6D3BFF] bg-white cursor-pointer transition select-none"
              >
                <span>Edit</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-4">
              {[
                { label: 'Allow recruiters to view my profile', key: 'allowRecruitersView' },
                { label: 'Allow profile in candidate search', key: 'allowSearchVisibility' },
                { label: 'Receive job recommendations', key: 'receiveJobRecommendations' },
                { label: 'Receive marketing communications', key: 'receiveMarketing' }
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => togglePrivacy(item.key)}
                  className="flex items-center gap-2.5 text-slate-650 font-bold hover:text-slate-900 cursor-pointer select-none group shrink-0"
                >
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                    privacy[item.key]
                      ? 'bg-[#6D3BFF] border-[#6D3BFF] text-white shadow-xs' 
                      : 'border-slate-350 bg-white group-hover:border-violet-400'
                  }`}>
                    {privacy[item.key] && <Check size={10} strokeWidth={4} />}
                  </div>
                  <span className="text-[11px]">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card 5: Language & Accessibility */}
          <div ref={accessibilityRef} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-left relative overflow-hidden transition-all hover:shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 text-[#6D3BFF] flex items-center justify-center shrink-0">
                  <Sliders size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">Language & Accessibility</h3>
                  <p className="text-[10px] font-semibold text-slate-450 mt-0.5">Customize your language and accessibility preferences.</p>
                </div>
              </div>
              <button 
                onClick={() => triggerToast('Modify settings directly inside this panel.')}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-violet-300 rounded-xl text-[10px] font-black text-slate-650 hover:text-[#6D3BFF] bg-white cursor-pointer transition select-none"
              >
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Language Selection */}
              <div className="md:col-span-4 flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Language</span>
                <select
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    triggerToast(`Language changed to ${e.target.value}.`);
                  }}
                  className="h-9 rounded-xl border border-slate-250 bg-slate-50/50 px-3 text-xs font-bold text-slate-700 outline-none focus:border-[#6D3BFF] cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>

              {/* Accessibility Options */}
              <div className="md:col-span-8 flex flex-wrap gap-x-6 gap-y-2 items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Accessibility</span>
                
                <button
                  onClick={() => toggleAccessibility('largerText')}
                  className="flex items-center gap-2.5 text-slate-650 font-bold hover:text-slate-900 cursor-pointer select-none group"
                >
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                    accessibility.largerText
                      ? 'bg-[#6D3BFF] border-[#6D3BFF] text-white shadow-xs' 
                      : 'border-slate-350 bg-white group-hover:border-violet-400'
                  }`}>
                    {accessibility.largerText && <Check size={10} strokeWidth={4} />}
                  </div>
                  <span className="text-[11px]">Larger Text</span>
                </button>

                <button
                  onClick={() => toggleAccessibility('highContrastMode')}
                  className="flex items-center gap-2.5 text-slate-650 font-bold hover:text-slate-900 cursor-pointer select-none group"
                >
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                    accessibility.highContrastMode
                      ? 'bg-[#6D3BFF] border-[#6D3BFF] text-white shadow-xs' 
                      : 'border-slate-350 bg-white group-hover:border-violet-400'
                  }`}>
                    {accessibility.highContrastMode && <Check size={10} strokeWidth={4} />}
                  </div>
                  <span className="text-[11px]">High Contrast Mode</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar options */}
        <div className="space-y-6 lg:sticky lg:top-4">
          
          {/* Card R1: Profile Visibility Selectable Options */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs text-left transition hover:shadow-sm">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Laptop size={15} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800">Profile Visibility</h4>
                <p className="text-[9px] font-bold text-slate-400 mt-0.5">Control your availability status for recruiters.</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { 
                  id: 'available', 
                  title: 'Available for Apprenticeship', 
                  desc: 'Actively looking for opportunities', 
                  badge: 'bg-emerald-500', 
                  border: 'hover:border-emerald-300',
                  activeBorder: 'border-emerald-500 bg-emerald-50/10'
                },
                { 
                  id: 'open', 
                  title: 'Open to Opportunities', 
                  desc: 'Open to the right opportunities', 
                  badge: 'bg-amber-500', 
                  border: 'hover:border-amber-300',
                  activeBorder: 'border-amber-500 bg-amber-50/10'
                },
                { 
                  id: 'not_looking', 
                  title: 'Not Looking Currently', 
                  desc: 'Not actively looking for now', 
                  badge: 'bg-rose-500', 
                  border: 'hover:border-rose-300',
                  activeBorder: 'border-rose-500 bg-rose-50/10'
                }
              ].map(opt => {
                const isSel = availability === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleAvailabilityChange(opt.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition duration-200 cursor-pointer flex items-start gap-3 select-none ${
                      isSel ? opt.activeBorder : 'border-slate-200 bg-white ' + opt.border
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${opt.badge}`} />
                    <div className="space-y-0.5">
                      <h5 className="text-[11px] font-black text-slate-800 leading-tight">{opt.title}</h5>
                      <p className="text-[9px] font-bold text-slate-450">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card R2: Document Summary Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs text-left transition hover:shadow-sm">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-violet-50 text-[#6D3BFF] flex items-center justify-center shrink-0">
                <FileText size={15} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800">Document Summary</h4>
                <p className="text-[9px] font-bold text-slate-400 mt-0.5">Apprenticeship onboarding papers.</p>
              </div>
            </div>

            <div className="space-y-2.5 mb-4">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                <span className="flex items-center gap-1.5"><FileText size={12} className="text-slate-400" /> Uploaded Documents</span>
                <span className="font-black text-[#6D3BFF]">5</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" /> Verified Documents</span>
                <span className="font-black text-emerald-600">3</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                <span className="flex items-center gap-1.5"><AlertCircle size={12} className="text-amber-500" /> Pending Verification</span>
                <span className="font-black text-amber-600">2</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (onSectionChange) onSectionChange('documents');
              }}
              className="w-full h-9 rounded-xl border border-slate-200 hover:border-violet-300 hover:text-[#6D3BFF] bg-white text-[11px] font-black text-slate-650 transition cursor-pointer select-none"
            >
              Manage Documents
            </button>
          </div>

          {/* Card R3: Support & Help */}
          <div ref={supportRef} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs text-left transition hover:shadow-sm">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-violet-50 text-[#6D3BFF] flex items-center justify-center shrink-0">
                <HelpCircle size={15} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800">Support & Help</h4>
                <p className="text-[9px] font-bold text-slate-400 mt-0.5">Need assistance or have queries?</p>
              </div>
            </div>

            <div className="space-y-1">
              {[
                { label: 'Contact Support', action: () => setModalType('contactSupport') },
                { label: 'Raise a Ticket', action: () => setModalType('raiseTicket') },
                { label: 'FAQs', action: () => triggerToast('Redirecting to EvenCargo Help & FAQ console...') },
                { label: 'Terms & Conditions', action: () => triggerToast('Opening Platform Terms & Conditions document...') },
                { label: 'Privacy Policy', action: () => triggerToast('Opening Privacy Policy agreement...') }
              ].map((link, idx) => (
                <button
                  key={idx}
                  onClick={link.action}
                  className="w-full flex justify-between items-center py-2.5 px-2 rounded-xl text-[10px] font-bold text-slate-650 hover:bg-slate-50 hover:text-[#6D3BFF] transition cursor-pointer text-left select-none"
                >
                  <span>{link.label}</span>
                  <ChevronRight size={12} className="text-slate-400" />
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Danger Zone - Full Width Section at the End of Settings Page */}
      <div ref={dangerRef} className="rounded-3xl border border-rose-200/80 bg-rose-50/40 p-6 shadow-xs text-left transition hover:shadow-sm">
        <div className="flex items-center gap-3 border-b border-rose-100 pb-4 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-rose-100/80 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h4 className="text-sm font-black text-rose-900">Danger Zone</h4>
            <p className="text-xs font-semibold text-rose-600/80 mt-0.5">Actions that affect account status.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Deactivate Account */}
          <div className="rounded-2xl border border-rose-200/60 bg-white p-4 flex flex-col justify-between space-y-3 transition hover:border-rose-300">
            <div className="space-y-1">
              <h5 className="text-xs font-black text-slate-800">Deactivate Account</h5>
              <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">Temporarily disable your profile visibility.</p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setConfirmInput('');
                  setModalType('deactivate');
                }}
                className="h-9 px-4 border border-rose-200 hover:bg-rose-50 hover:border-rose-300 text-xs font-black text-rose-700 rounded-xl transition cursor-pointer select-none shadow-2xs"
              >
                Deactivate
              </button>
            </div>
          </div>

          {/* Delete Account */}
          <div className="rounded-2xl border border-rose-200/60 bg-white p-4 flex flex-col justify-between space-y-3 transition hover:border-rose-300">
            <div className="space-y-1">
              <h5 className="text-xs font-black text-rose-800">Delete Account</h5>
              <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">Permanently remove your account and application data.</p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setConfirmInput('');
                  setModalType('delete');
                }}
                className="h-9 px-4 bg-rose-600 hover:bg-rose-700 text-xs font-black text-white rounded-xl transition cursor-pointer select-none shadow-xs"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL DIALOGS SECTION */}
      {/* ========================================================================= */}
      
      {modalType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl p-6 flex flex-col space-y-5 animate-scale-up text-left text-xs font-sans">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                {modalType === 'changeEmail' && <Mail size={16} className="text-[#6D3BFF]" />}
                {modalType === 'changeMobile' && <Smartphone size={16} className="text-[#6D3BFF]" />}
                {modalType === 'changePassword' && <Lock size={16} className="text-[#6D3BFF]" />}
                {modalType === 'logoutSessions' && <LogOut size={16} className="text-rose-600" />}
                {modalType === 'deactivate' && <AlertTriangle size={16} className="text-amber-500" />}
                {modalType === 'delete' && <ShieldAlert size={16} className="text-rose-600" />}
                {modalType === 'raiseTicket' && <HelpCircle size={16} className="text-[#6D3BFF]" />}
                {modalType === 'contactSupport' && <HelpCircle size={16} className="text-[#6D3BFF]" />}
                
                <span>
                  {modalType === 'changeEmail' && 'Change Email Address'}
                  {modalType === 'changeMobile' && 'Change Mobile Number'}
                  {modalType === 'changePassword' && 'Change Password'}
                  {modalType === 'logoutSessions' && 'Logout Other Sessions'}
                  {modalType === 'deactivate' && 'Deactivate Candidate Account'}
                  {modalType === 'delete' && 'Delete Candidate Account'}
                  {modalType === 'raiseTicket' && 'Raise Support Ticket'}
                  {modalType === 'contactSupport' && 'Contact Support Desk'}
                </span>
              </h3>
              <button 
                onClick={() => setModalType(null)}
                className="p-1 rounded-full text-slate-450 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}

            {/* Change Email */}
            {modalType === 'changeEmail' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-450 block">Current Email Address</span>
                  <p className="text-xs font-black text-slate-800">{profile.email}</p>
                </div>
                {emailModalData.step === 1 ? (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider pl-0.5">New Email Address</label>
                      <input 
                        type="email" 
                        value={emailModalData.newEmail}
                        onChange={(e) => setEmailModalData(prev => ({ ...prev, newEmail: e.target.value }))}
                        placeholder="e.g. harsh@example.com"
                        className="w-full h-10 rounded-xl border border-slate-250 px-3 text-xs outline-none focus:border-[#6D3BFF]"
                      />
                    </div>
                    <button 
                      onClick={handleSendEmailOTP}
                      className="w-full h-10 bg-[#6D3BFF] text-white font-black rounded-xl cursor-pointer"
                    >
                      Send Verification Code
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider pl-0.5">Verification Code</label>
                      <input 
                        type="text" 
                        value={emailModalData.otp}
                        onChange={(e) => setEmailModalData(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                        placeholder="Enter 4-digit code"
                        className="w-full h-10 rounded-xl border border-slate-250 px-3 text-xs tracking-widest text-center font-black outline-none focus:border-[#6D3BFF]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEmailModalData(prev => ({ ...prev, step: 1 }))}
                        className="flex-1 h-10 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl cursor-pointer"
                      >
                        Back
                      </button>
                      <button 
                        onClick={handleVerifyEmailOTP}
                        className="flex-1 h-10 bg-[#6D3BFF] text-white font-black rounded-xl cursor-pointer"
                      >
                        Verify & Update
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Change Mobile */}
            {modalType === 'changeMobile' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-450 block">Current Mobile Number</span>
                  <p className="text-xs font-black text-slate-800">+91 {profile.mobileNumber}</p>
                </div>
                {phoneModalData.step === 1 ? (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider pl-0.5">New Mobile Number</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">+91</span>
                        <input 
                          type="tel" 
                          value={phoneModalData.newPhone}
                          onChange={(e) => setPhoneModalData(prev => ({ ...prev, newPhone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                          placeholder="10-digit mobile number"
                          className="w-full h-10 rounded-xl border border-slate-250 pl-11 pr-3 text-xs outline-none focus:border-[#6D3BFF]"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={handleSendMobileOTP}
                      className="w-full h-10 bg-[#6D3BFF] text-white font-black rounded-xl cursor-pointer"
                    >
                      Send OTP
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider pl-0.5">Enter 4-Digit OTP</label>
                      <input 
                        type="text" 
                        value={phoneModalData.otp}
                        onChange={(e) => setPhoneModalData(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                        placeholder="0000"
                        className="w-full h-10 rounded-xl border border-slate-250 px-3 text-xs tracking-widest text-center font-black outline-none focus:border-[#6D3BFF]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setPhoneModalData(prev => ({ ...prev, step: 1 }))}
                        className="flex-1 h-10 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl cursor-pointer"
                      >
                        Back
                      </button>
                      <button 
                        onClick={handleVerifyMobileOTP}
                        className="flex-1 h-10 bg-[#6D3BFF] text-white font-black rounded-xl cursor-pointer"
                      >
                        Verify & Update
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Change Password */}
            {modalType === 'changePassword' && (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider pl-0.5">Current Password</label>
                    <div className="relative">
                      <input 
                        type={passwordModalData.show ? 'text' : 'password'}
                        value={passwordModalData.current}
                        onChange={(e) => setPasswordModalData(prev => ({ ...prev, current: e.target.value }))}
                        placeholder="Current password"
                        className="w-full h-10 rounded-xl border border-slate-250 px-3 pr-10 text-xs outline-none focus:border-[#6D3BFF]"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => setPasswordModalData(prev => ({ ...prev, show: !prev.show }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {passwordModalData.show ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider pl-0.5">New Password</label>
                    <input 
                      type="password" 
                      value={passwordModalData.newPass}
                      onChange={(e) => setPasswordModalData(prev => ({ ...prev, newPass: e.target.value }))}
                      placeholder="At least 6 characters"
                      className="w-full h-10 rounded-xl border border-slate-250 px-3 text-xs outline-none focus:border-[#6D3BFF]"
                      required
                    />
                    {passwordModalData.newPass && (
                      <div className="flex items-center gap-1 pl-0.5 pt-0.5">
                        <span className="text-[9px] font-bold text-slate-400">Strength:</span>
                        <span className={`text-[9px] font-black uppercase ${
                          passwordModalData.newPass.length < 6 ? 'text-rose-600' :
                          passwordModalData.newPass.length < 10 ? 'text-amber-600' :
                          'text-emerald-600'
                        }`}>
                          {passwordModalData.newPass.length < 6 ? 'Weak' : passwordModalData.newPass.length < 10 ? 'Medium' : 'Strong'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider pl-0.5">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passwordModalData.confirm}
                      onChange={(e) => setPasswordModalData(prev => ({ ...prev, confirm: e.target.value }))}
                      placeholder="Repeat new password"
                      className="w-full h-10 rounded-xl border border-slate-250 px-3 text-xs outline-none focus:border-[#6D3BFF]"
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full h-10 bg-[#6D3BFF] text-white font-black rounded-xl cursor-pointer"
                >
                  Update Password
                </button>
              </form>
            )}

            {/* Logout Other Sessions */}
            {modalType === 'logoutSessions' && (
              <div className="space-y-4">
                <p className="text-slate-600 font-semibold leading-relaxed">
                  Are you sure you want to log out from all other active sessions? This will log out your account from all other devices and web browsers except this one.
                </p>
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setModalType(null)}
                    className="flex-1 h-10 border border-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleLogoutAllDevices}
                    className="flex-1 h-10 bg-rose-600 text-white font-black rounded-xl cursor-pointer"
                  >
                    Logout Others
                  </button>
                </div>
              </div>
            )}

            {/* Deactivate Account */}
            {modalType === 'deactivate' && (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3.5 rounded-2xl flex items-start gap-3">
                  <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-black text-xs leading-none">Temporary Suspension</h4>
                    <p className="text-[10px] font-semibold text-amber-700 leading-normal">
                      This will hide your profile from the apprenticeship matching pool and stop all incoming job notifications. You can reactivate your profile status by logging back in.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-450 block">To confirm, type <span className="font-black text-slate-800">DEACTIVATE</span> below:</label>
                  <input 
                    type="text" 
                    value={confirmInput}
                    onChange={(e) => setConfirmInput(e.target.value)}
                    placeholder="Type DEACTIVATE"
                    className="w-full h-10 rounded-xl border border-slate-250 px-3 text-xs outline-none focus:border-rose-500 font-black uppercase text-center"
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setModalType(null)}
                    className="flex-1 h-10 border border-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeactivate}
                    disabled={confirmInput.toUpperCase() !== 'DEACTIVATE'}
                    className="flex-1 h-10 bg-rose-600 disabled:opacity-40 text-white font-black rounded-xl cursor-pointer"
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            )}

            {/* Delete Account */}
            {modalType === 'delete' && (
              <div className="space-y-4">
                <div className="bg-rose-50 border border-rose-250 text-rose-800 p-3.5 rounded-2xl flex items-start gap-3">
                  <ShieldAlert size={18} className="text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-black text-xs leading-none">Permanent Account Deletion</h4>
                    <p className="text-[10px] font-semibold text-rose-700 leading-normal">
                      This is irreversible. All your candidate profile details, documents, application history and interview logs will be deleted permanently.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-450 block">To confirm, type <span className="font-black text-rose-700">DELETE</span> below:</label>
                  <input 
                    type="text" 
                    value={confirmInput}
                    onChange={(e) => setConfirmInput(e.target.value)}
                    placeholder="Type DELETE"
                    className="w-full h-10 rounded-xl border border-slate-250 px-3 text-xs outline-none focus:border-rose-500 font-black uppercase text-center"
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setModalType(null)}
                    className="flex-1 h-10 border border-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeleteAccount}
                    disabled={confirmInput.toUpperCase() !== 'DELETE'}
                    className="flex-1 h-10 bg-rose-600 disabled:opacity-40 text-white font-black rounded-xl cursor-pointer"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* Contact Support */}
            {modalType === 'contactSupport' && (
              <div className="space-y-4">
                <div className="space-y-2.5">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="text-[9px] font-black text-slate-400 block uppercase">Office Helpline</span>
                    <p className="text-xs font-black text-slate-800">+91 11-4093-5400</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="text-[9px] font-black text-slate-400 block uppercase">Email Support</span>
                    <p className="text-xs font-black text-[#6D3BFF]">support@evencargo.in</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="text-[9px] font-black text-slate-400 block uppercase">Support Hours</span>
                    <p className="text-xs font-bold text-slate-700">Monday to Friday, 9:00 AM - 6:00 PM IST</p>
                  </div>
                </div>
                <button 
                  onClick={() => setModalType('raiseTicket')}
                  className="w-full h-10 bg-[#6D3BFF] text-white font-black rounded-xl cursor-pointer"
                >
                  Raise a Ticket Instead
                </button>
              </div>
            )}

            {/* Raise a Ticket */}
            {modalType === 'raiseTicket' && (
              <form onSubmit={handleRaiseTicket} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block pl-0.5">Category</label>
                  <select
                    value={ticketModalData.category}
                    onChange={(e) => setTicketModalData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full h-9 rounded-xl border border-slate-250 px-2 text-xs font-bold text-slate-700 outline-none focus:border-[#6D3BFF] cursor-pointer"
                  >
                    <option value="General">General Query</option>
                    <option value="Documents">Document Verification</option>
                    <option value="Interviews">Interview Schedules</option>
                    <option value="Profile">Profile Settings</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block pl-0.5">Subject</label>
                  <input 
                    type="text" 
                    value={ticketModalData.subject}
                    onChange={(e) => setTicketModalData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Brief description of the issue"
                    className="w-full h-9 rounded-xl border border-slate-250 px-3 text-xs outline-none focus:border-[#6D3BFF]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block pl-0.5">Message Details</label>
                  <textarea 
                    value={ticketModalData.message}
                    onChange={(e) => setTicketModalData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Describe your issue or query in detail..."
                    rows={4}
                    className="w-full rounded-xl border border-slate-250 p-3 text-xs outline-none focus:border-[#6D3BFF]"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full h-10 bg-[#6D3BFF] text-white font-black rounded-xl cursor-pointer"
                >
                  Submit Support Ticket
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

// Inline custom sub-component to draw ShieldCheck icon with clean shape
function ShieldCheckIcon({ size = 18 }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V5a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 5z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
