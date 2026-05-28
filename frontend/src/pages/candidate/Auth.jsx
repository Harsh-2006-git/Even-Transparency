import { useState } from 'react';
import { ArrowLeft, CheckCircle2, UserPlus } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const initialForm = {
  first_name: '',
  last_name: '',
  full_name: '',
  gender: '',
  date_of_birth: '',
  mobile_number: '',
  email: '',
  preferred_language: '',
  aadhaar_number_encrypted: '',
  aadhaar_last_4: '',
  pan_number: '',
  digilocker_linked: false,
  naps_candidate_id: '',
  registration_date: '',
  profile_completion_percentage: 0,
  onboarding_status: 'pending',
  verification_status: 'pending',
  availability_status: 'available',
  password: ''
};

export default function CandidateAuth({ onAuthSuccess, onBackToLogin }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/auth/candidate/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed.');
      onAuthSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-indigo-600" />
              Candidate Registration
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">Create your candidate profile using the fields from the Candidate model.</p>
          </div>
          <button type="button" onClick={onBackToLogin} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(initialForm).map((key) => {
              if (key === 'digilocker_linked') {
                return (
                  <label key={key} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 bg-slate-50">
                    <span className="text-xs font-bold text-slate-700">DigiLocker Linked</span>
                    <input type="checkbox" checked={form[key]} onChange={(e) => update(key, e.target.checked)} />
                  </label>
                );
              }
              return (
                <label key={key} className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{key.replaceAll('_', ' ')}</span>
                  <input
                    type={key.includes('date') ? 'date' : key === 'password' ? 'password' : 'text'}
                    value={form[key]}
                    onChange={(e) => update(key, e.target.value)}
                    className="w-full h-11 rounded-xl border border-slate-200 px-3 text-xs font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
                  />
                </label>
              );
            })}
          </div>

          {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">{error}</div>}

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={() => setForm(initialForm)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50">
              Reset
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 disabled:opacity-60 inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {loading ? 'Submitting...' : 'Submit Candidate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
