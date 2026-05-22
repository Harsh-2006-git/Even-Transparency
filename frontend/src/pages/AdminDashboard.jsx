import { useState } from 'react';
import { Sliders, Database, Users, UserPlus, CheckCircle, AlertTriangle, BookOpen, UserX, UserCheck } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const ASSESSMENT_WEIGHTS = [
  { id: 'driving', title: 'Driving & Road Awareness', weight: 30, questions: 8 },
  { id: 'navigation', title: 'Logistics & Tech Literacy', weight: 25, questions: 7 },
  { id: 'communication', title: 'Client Communication & Soft Skills', weight: 25, questions: 7 },
  { id: 'ownership', title: 'Safety & Ownership Readiness', weight: 20, questions: 6 }
];

export default function AdminDashboard({ adminUser, candidates = [] }) {
  // Registration form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState('Mobiliser');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleRegisterStaff = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!username.trim() || !email.trim() || !password.trim()) {
      setMessage({ type: 'error', text: 'Username, Email, and Password are required.' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-id': adminUser.id // Pass the admin's database ID to authorize user registration
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
          phone: phone.trim() || null,
          userType
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register staff account.');
      }

      setMessage({ type: 'success', text: `Staff account "${username}" (${userType}) created successfully!` });
      
      // Reset registration form
      setUsername('');
      setEmail('');
      setPassword('');
      setPhone('');
      setUserType('Mobiliser');
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div id="overview">
        <h2 className="text-xl font-bold text-slate-800">Admin Control Panel</h2>
        <p className="text-xs text-slate-500 mt-1">Configure scoring formulas, register operational staff members, and audit synchronized database schemas.</p>
      </div>

      {/* Stats Summary Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Total Candidates</span>
            <span className="text-2xl font-bold text-slate-800 mt-0.5 block">{candidates.length}</span>
          </div>
          <span className="p-2.5 bg-indigo-50 text-indigo-650 rounded-xl border border-indigo-100">
            <Users className="h-5 w-5" />
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Converted</span>
            <span className="text-2xl font-bold text-emerald-650 mt-0.5 block">
              {candidates.filter(c => c.status === 'converted' || !c.status).length}
            </span>
          </div>
          <span className="p-2.5 bg-emerald-50 text-emerald-650 rounded-xl border border-emerald-100">
            <UserCheck className="h-5 w-5" />
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Training Started</span>
            <span className="text-2xl font-bold text-amber-650 mt-0.5 block">
              {candidates.filter(c => c.status === 'training started').length}
            </span>
          </div>
          <span className="p-2.5 bg-amber-50 text-amber-650 rounded-xl border border-amber-100">
            <BookOpen className="h-5 w-5" />
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Dropped</span>
            <span className="text-2xl font-bold text-rose-650 mt-0.5 block">
              {candidates.filter(c => c.status === 'dropped').length}
            </span>
          </div>
          <span className="p-2.5 bg-rose-50 text-rose-650 rounded-xl border border-rose-100">
            <UserX className="h-5 w-5" />
          </span>
        </div>
      </section>

      {/* Staff Registration Panel & weights */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Register Staff Form */}
        <div id="register-staff" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-4">
              <UserPlus className="w-4.5 h-4.5 text-indigo-650 shrink-0" />
              <h3 className="font-bold text-slate-850 text-sm">Register Staff Member</h3>
            </div>

            <form onSubmit={handleRegisterStaff} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Username *</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. priya_mobiliser"
                  className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. priya@evencargo.in"
                  className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 999..."
                    className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Role Type</label>
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-indigo-600 transition"
                  >
                    <option value="Mobiliser">Mobiliser</option>
                    <option value="City Manager">City Manager</option>
                    <option value="Operations">Operations</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-indigo-650 hover:bg-indigo-750 text-white font-bold rounded-lg transition active:scale-95 shadow-sm mt-3"
              >
                {loading ? 'Creating Account...' : 'Create Staff Account'}
              </button>
            </form>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-xs font-semibold border flex items-start space-x-2 ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-250 text-emerald-800'
                : 'bg-rose-50 border-rose-250 text-rose-800'
            }`}>
              <span>{message.text}</span>
            </div>
          )}
        </div>

        {/* Scoring weights list */}
        <div id="domain-weights" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4.5 h-4.5 text-indigo-650 shrink-0" />
            <h3 className="font-bold text-slate-850 text-sm">Interview Domain Weights</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ASSESSMENT_WEIGHTS.map(domain => (
              <div key={domain.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">{domain.id} config</span>
                
                <div>
                  <h4 className="font-bold text-slate-700">{domain.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{domain.questions} Questions</p>
                </div>

                <div className="flex items-baseline space-x-1 border-t border-slate-200/65 pt-2">
                  <span className="text-xl font-black text-indigo-700">{domain.weight}%</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">weight</span>
                </div>

                <div>
                  <input 
                    type="range" 
                    min="10" 
                    max="50" 
                    defaultValue={domain.weight}
                    className="w-full accent-indigo-650 cursor-not-allowed" 
                    disabled
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start space-x-2.5 text-[11px] text-slate-500">
            <Sliders className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
            <p>Weight criteria updates are restricted to active operational cycles to preserve recruitment integrity.</p>
          </div>
        </div>

      </section>

      {/* Database Schema stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div id="database-schema" className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Database className="w-4.5 h-4.5 text-indigo-650 shrink-0" />
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Database schema metrics</h3>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-xs font-mono text-slate-655">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span>Target DB provider:</span>
              <span className="text-indigo-700 font-bold">PostgreSQL</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span>Candidates table sync:</span>
              <span className="text-emerald-600 font-bold">Synchronized</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span>Users table sync:</span>
              <span className="text-emerald-600 font-bold">Synchronized</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Sequelize syncing:</span>
              <span className="text-slate-850 font-bold">alter: true</span>
            </div>
          </div>
        </div>

        <div id="access-privileges" className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Users className="w-4.5 h-4.5 text-indigo-650 shrink-0" />
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Access privileges</h3>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2.5 text-slate-600">
            <p>• <strong>Mobiliser:</strong> Conduct assessments & update outcome states.</p>
            <p>• <strong>City Manager:</strong> View all candidates & check analytics charts.</p>
            <p>• <strong>Operations:</strong> Export tables & verify calibration criteria.</p>
            <p>• <strong>Admin:</strong> Create user logins & calibrate weights.</p>
          </div>
        </div>

      </section>

    </div>
  );
}
