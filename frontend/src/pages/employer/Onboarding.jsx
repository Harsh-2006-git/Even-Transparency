import { useState } from 'react';
import {
  Building2,
  FileBadge2,
  MapPin,
  Heart,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Info,
  User,
  ShieldCheck,
  Phone,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  Check
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const COMPLIANCE_VALIDATIONS = [
  {
    key: 'pan_number',
    label: 'PAN Number',
    required: true,
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
    message: 'PAN Number must be 10 characters in the format ABCDE1234F.'
  },
  {
    key: 'gst_number',
    label: 'GSTIN / Tax Number',
    pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
    message: 'GSTIN must be 15 characters in the standard GST format, for example 27ABCDE1234F1Z5.'
  },
  {
    key: 'cin_number',
    label: 'Corporate ID (CIN)',
    pattern: /^[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/,
    message: 'CIN must be 21 characters in the MCA format, for example U12345DL2024PTC123456.'
  },
  {
    key: 'naps_establishment_id',
    label: 'NAPS Establishment ID',
    pattern: /^[A-Z0-9/-]{4,30}$/,
    message: 'NAPS Establishment ID must be 4-30 characters using letters, numbers, slash, or hyphen.'
  },
  {
    key: 'esic_registration_number',
    label: 'ESIC Registration',
    pattern: /^[0-9]{17}$/,
    message: 'ESIC Registration must be exactly 17 digits.'
  },
  {
    key: 'epfo_registration_number',
    label: 'EPFO Registration',
    pattern: /^[A-Z0-9/-]{5,30}$/,
    message: 'EPFO Registration must be 5-30 characters using letters, numbers, slash, or hyphen.'
  }
];

const uppercaseFields = new Set([
  'pan_number',
  'gst_number',
  'cin_number',
  'naps_establishment_id',
  'epfo_registration_number'
]);

const INDIA_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

const INDIA_STATES_DATA = {
  "Delhi": {
    districts: ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
    cities: ["Delhi", "New Delhi", "Dwarka", "Rohini", "Najafgarh", "Narela", "Patparganj"]
  },
  "Maharashtra": {
    districts: ["Mumbai City", "Mumbai Suburban", "Pune", "Thane", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Nanded", "Sangli", "Jalgaon", "Akola", "Latur", "Satara", "Raigad"],
    cities: ["Mumbai", "Pune", "Thane", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Navi Mumbai", "Latur", "Satara"]
  },
  "Karnataka": {
    districts: ["Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Belagavi", "Dharwad", "Mangaluru", "Kalaburagi", "Davangere", "Ballari", "Tumakuru", "Shivamogga", "Udupi"],
    cities: ["Bengaluru", "Mysuru", "Mangaluru", "Hubli", "Dharwad", "Belagavi", "Kalaburagi", "Davangere", "Ballari", "Tumakuru", "Shivamogga", "Udupi"]
  },
  "Haryana": {
    districts: ["Ambala", "Bhiwani", "Faridabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
    cities: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Sonipat", "Rohtak", "Hisar", "Panchkula", "Yamunanagar"]
  },
  "Uttar Pradesh": {
    districts: ["Agra", "Aligarh", "Ayodhya", "Bareilly", "Bulandshahr", "Gautam Buddha Nagar", "Ghaziabad", "Gorakhpur", "Jhansi", "Kanpur Nagar", "Lucknow", "Mathura", "Meerut", "Moradabad", "Muzaffarnagar", "Prayagraj", "Saharanpur", "Varanasi"],
    cities: ["Noida", "Greater Noida", "Ghaziabad", "Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Prayagraj", "Bareilly", "Aligarh"]
  },
  "Tamil Nadu": {
    districts: ["Chennai", "Coimbatore", "Cuddalore", "Dindigul", "Erode", "Kanchipuram", "Kanyakumari", "Madurai", "Namakkal", "Salem", "Thanjavur", "Thoothukudi", "Tiruchirappalli", "Tiruppur", "Vellore"],
    cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Erode", "Vellore", "Thoothukudi", "Kanchipuram"]
  },
  "Telangana": {
    districts: ["Hyderabad", "Karimnagar", "Khammam", "Mahabubnagar", "Medchal-Malkajgiri", "Nalgonda", "Nizamabad", "Rangareddy", "Siddipet", "Warangal Rural", "Warangal Urban"],
    cities: ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Secunderabad"]
  },
  "Gujarat": {
    districts: ["Ahmedabad", "Anand", "Bharuch", "Bhavnagar", "Gandhinagar", "Jamnagar", "Junagadh", "Mehsana", "Morbi", "Rajkot", "Surat", "Vadodara", "Valsad"],
    cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Anand"]
  },
  "West Bengal": {
    districts: ["Darjeeling", "Hooghly", "Howrah", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Medinipur", "Purba Medinipur", "South 24 Parganas"],
    cities: ["Kolkata", "Howrah", "Siliguri", "Asansol", "Durgapur", "Kharagpur", "Haldia"]
  },
  "Rajasthan": {
    districts: ["Ajmer", "Alwar", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Jaipur", "Jodhpur", "Kota", "Sikar", "Udaipur"],
    cities: ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara"]
  },
  "Andhra Pradesh": {
    districts: ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Visakhapatnam", "West Godavari"],
    cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati"]
  },
  "Bihar": {
    districts: ["Aurangabad", "Begusarai", "Bhagalpur", "Darbhanga", "Gaya", "Muzaffarpur", "Nalanda", "Patna", "Purnia", "Rohtas", "Saran"],
    cities: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Bihar Sharif"]
  },
  "Madhya Pradesh": {
    districts: ["Bhopal", "Gwalior", "Indore", "Jabalpur", "Ratlam", "Rewa", "Sagar", "Satna", "Ujjain"],
    cities: ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"]
  },
  "Punjab": {
    districts: ["Amritsar", "Bathinda", "Hoshiarpur", "Jalandhar", "Ludhiana", "Moga", "Pathankot", "Patiala", "Sahibzada Ajit Singh Nagar", "Sangrur"],
    cities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali"]
  },
  "Kerala": {
    districts: ["Alappuzha", "Ernakulam", "Kannur", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Thiruvananthapuram", "Thrissurs"],
    cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"]
  },
  "Odisha": {
    districts: ["Balasore", "Cuttack", "Ganjam", "Jharsuguda", "Khordha", "Puri", "Sambalpur", "Sundargarh"],
    cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"]
  },
  "Chhattisgarh": {
    districts: ["Raipur", "Durg", "Bilaspur", "Korba", "Rajnandgaon", "Jagdalpur"],
    cities: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon"]
  },
  "Jharkhand": {
    districts: ["Ranchi", "East Singhbhum", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar"],
    cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Hazaribagh"]
  },
  "Uttarakhand": {
    districts: ["Dehradun", "Haridwar", "Nainital", "Udham Singh Nagar", "Pithoragarh"],
    cities: ["Dehradun", "Haridwar", "Haldwani", "Roorkee", "Rudrapur"]
  },
  "Assam": {
    districts: ["Kamrup Metropolitan", "Dibrugarh", "Silchar", "Jorhat", "Nagaon", "Tinsukia"],
    cities: ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Nagaon"]
  },
  "Himachal Pradesh": {
    districts: ["Shimla", "Kangra", "Mandi", "Solan", "Kullu", "Sirmaur"],
    cities: ["Shimla", "Dharamshala", "Mandi", "Solan", "Nahan"]
  },
  "Jammu and Kashmir": {
    districts: ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua", "Udhampur"],
    cities: ["Srinagar", "Jammu", "Anantnag", "Baramulla"]
  },
  "Goa": {
    districts: ["North Goa", "South Goa"],
    cities: ["Panaji", "Margao", "Vasco da Gama", "Mapusa"]
  },
  "Chandigarh": {
    districts: ["Chandigarh"],
    cities: ["Chandigarh"]
  },
  "Puducherry": {
    districts: ["Puducherry", "Karaikal", "Mahe", "Yanam"],
    cities: ["Puducherry", "Karaikal"]
  },
  "Tripura": {
    districts: ["West Tripura", "South Tripura", "North Tripura", "Dhalai"],
    cities: ["Agartala", "Dharmanagar", "Udaipur"]
  },
  "Meghalaya": {
    districts: ["East Khasi Hills", "West Garo Hills", "West Jaintia Hills"],
    cities: ["Shillong", "Tura", "Jowai"]
  },
  "Manipur": {
    districts: ["Imphal West", "Imphal East", "Thoubal", "Churachandpur"],
    cities: ["Imphal", "Thoubal", "Churachandpur"]
  },
  "Nagaland": {
    districts: ["Dimapur", "Kohima", "Mokokchung"],
    cities: ["Dimapur", "Kohima", "Mokokchung"]
  },
  "Arunachal Pradesh": {
    districts: ["Papum Pare", "Changlang", "Lohit", "West Kameng"],
    cities: ["Itanagar", "Naharlagun"]
  },
  "Mizoram": {
    districts: ["Aizawl", "Lunglei", "Champhai"],
    cities: ["Aizawl", "Lunglei"]
  },
  "Sikkim": {
    districts: ["Gangtok", "Namchi", "Gyalshing", "Mangan"],
    cities: ["Gangtok", "Namchi"]
  },
  "Ladakh": {
    districts: ["Leh", "Kargil"],
    cities: ["Leh", "Kargil"]
  },
  "Andaman and Nicobar Islands": {
    districts: ["South Andaman", "North and Middle Andaman", "Nicobar"],
    cities: ["Port Blair"]
  },
  "Dadra and Nagar Haveli and Daman and Diu": {
    districts: ["Dadra and Nagar Haveli", "Daman", "Diu"],
    cities: ["Silvassa", "Daman", "Diu"]
  },
  "Lakshadweep": {
    districts: ["Lakshadweep"],
    cities: ["Kavaratti"]
  }
};

export default function EmployerOnboarding({ onOnboardingSuccess, onCancel }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [customLocationName, setCustomLocationName] = useState(false);
  const [customDistrict, setCustomDistrict] = useState(false);
  const [customCity, setCustomCity] = useState(false);
  const [customDepartment, setCustomDepartment] = useState(false);

  const [phase, setPhase] = useState('phone'); // 'phone' | 'otp' | 'password' | 'onboarding'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState('');
  const [employer, setEmployer] = useState(null);
  const [phoneStatus, setPhoneStatus] = useState('idle'); // 'idle' | 'pending_onboarding' | 'already_registered'
  const [resumePassword, setResumePassword] = useState('');
  const [showResumePassword, setShowResumePassword] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const passwordChecks = [
    { label: '6 characters', done: password.length >= 6 },
    { label: 'Capital letter', done: /[A-Z]/.test(password) },
    { label: 'Small letter', done: /[a-z]/.test(password) },
    { label: 'Number', done: /\d/.test(password) },
    { label: 'Special character', done: /[^A-Za-z0-9]/.test(password) }
  ];

  const renderAuthPhase = () => (
    <div className="w-full max-w-[520px] rounded-3xl border border-orange-200 bg-white p-6 sm:p-8 shadow-[0_16px_42px_rgba(234,88,12,0.06)] text-left">
      <div className="mb-7">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-650">
          <ShieldCheck size={13} className="text-orange-500" />
          Employer signup
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Create Partner Account</h2>
        <p className="mt-2 text-xs leading-5 text-slate-500 font-normal">Verify your company's official mobile number first. Dev OTP is shown inside the app.</p>
      </div>

      {phase === 'phone' && (
        <div className="space-y-5">
          <label className="space-y-1 block">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pl-0.5">Mobile number</span>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                  setPhoneStatus('idle');
                  setError('');
                }}
                className="w-full h-12 rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-800 outline-none focus:border-[#F39A42] transition placeholder:text-slate-400"
                placeholder="10 digit mobile number"
              />
            </div>
          </label>

          {/* Already registered */}
          {phoneStatus === 'already_registered' && (
            <div className="rounded-xl border border-amber-250 bg-amber-50 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-base font-black">!</span>
                <div>
                  <p className="text-sm font-bold text-amber-900">Account already exists</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-amber-700 font-medium">
                    This mobile number is already registered and company profile is complete. Please sign in to continue.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="w-full h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm transition active:scale-[0.99] cursor-pointer"
              >
                Go to Login →
              </button>
            </div>
          )}

          {/* Onboarding incomplete */}
          {phoneStatus === 'pending_onboarding' && (
            <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-base font-black">↩</span>
                <div>
                  <p className="text-sm font-bold text-orange-900">Welcome back!</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-orange-700 font-medium">
                    You started registration before but didn't finish the onboarding form. Enter your password below to pick up where you left off.
                  </p>
                </div>
              </div>
              <label className="space-y-1 block">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pl-0.5">Your password</span>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showResumePassword ? 'text' : 'password'}
                    value={resumePassword}
                    onChange={(e) => setResumePassword(e.target.value)}
                    className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    placeholder="Enter your password"
                  />
                  <button type="button" onClick={() => setShowResumePassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                    {showResumePassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>
              <button
                type="button"
                onClick={resumeOnboarding}
                disabled={loading || resumePassword.length < 6}
                className="w-full h-10 rounded-xl bg-[#F39A42] text-white text-xs font-bold shadow-sm transition hover:bg-orange-500 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {loading ? 'Verifying...' : 'Continue to Onboarding →'}
              </button>
            </div>
          )}

          {/* Idle State Continue Button */}
          {phoneStatus === 'idle' && (
            <button
              type="button"
              onClick={checkAndProceed}
              disabled={loading || phone.length !== 10}
              className="mt-1 w-full h-12 rounded-xl bg-[#F39A42] text-white text-sm font-bold shadow-sm shadow-orange-100 transition hover:bg-orange-500 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Checking...' : 'Continue'}
            </button>
          )}
        </div>
      )}

      {phase === 'otp' && (
        <div className="space-y-7">
          <div className="rounded-xl border border-orange-200 bg-orange-50/50 px-4 py-3 text-sm font-semibold text-orange-800">
            Dummy OTP: {devOtp || '123456'}
          </div>
          <label className="space-y-1 block">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pl-0.5">OTP</span>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full h-12 rounded-xl border border-slate-200 bg-white px-3.5 text-base tracking-[0.2em] text-slate-800 outline-none focus:border-[#F39A42] transition placeholder:text-slate-450 text-center"
              placeholder="Enter 6 digit OTP"
            />
          </label>
          <button
            type="button"
            onClick={verifyOtp}
            disabled={loading || otp.length !== 6}
            className="mt-1 w-full h-12 rounded-xl bg-[#F39A42] text-white text-sm font-bold shadow-sm transition hover:bg-orange-500 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            Verify OTP
          </button>
        </div>
      )}

      {phase === 'password' && (
        <div className="space-y-6">
          <label className="space-y-1 block">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pl-0.5">Strong password</span>
            <div className="relative">
              <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-base font-semibold outline-none focus:border-[#F39A42] transition"
                placeholder="Create a strong password"
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-655 cursor-pointer">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {/* Password strength checklist */}
          <div className="mt-3 rounded-xl border border-orange-100 bg-orange-50/30 px-3 py-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px]">
              {passwordChecks.map((item) => (
                <span key={item.label} className={`inline-flex min-h-6 items-center gap-1.5 rounded-md px-2 py-1 font-semibold transition ${item.done ? 'bg-white text-emerald-700 shadow-sm' : 'bg-white/40 text-slate-500'}`}>
                  <span className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full ${item.done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    {item.done ? <Check size={9} strokeWidth={3} className="text-emerald-700" /> : <CheckCircle2 size={10} />}
                  </span>
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={createAccount}
            disabled={loading || !passwordChecks.every(item => item.done)}
            className="w-full h-12 rounded-xl bg-[#F39A42] text-white text-sm font-bold shadow-sm transition hover:bg-orange-500 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            Create Account
          </button>
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-xl border border-rose-250 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      <div className="mt-7 border-t border-slate-150 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-lg px-1 py-1 text-xs font-bold text-slate-500 transition hover:text-slate-800 cursor-pointer"
        >
          <ArrowLeft size={15} />
          Back to login
        </button>
      </div>
    </div>
  );

  const initFormData = (employerData, userData, currentPassword) => {
    const dept = userData?.department || 'Administration';
    const standardDepts = ['Human Resources (HR)', 'Administration', 'Operations', 'Logistics / Supply Chain', 'Training / L&D', 'Finance / Legal'];
    if (dept && !standardDepts.includes(dept)) {
      setCustomDepartment(true);
    } else {
      setCustomDepartment(false);
    }
    setFormData(prev => ({
      ...prev,
      company_name: employerData?.company_name === 'Pending Onboarding' ? '' : (employerData?.company_name || ''),
      legal_entity_name: employerData?.legal_entity_name || '',
      company_type: employerData?.company_type || 'Pvt Ltd',
      industry_sector: employerData?.industry_sector || 'Logistics',
      company_size: employerData?.company_size || 'Startup',
      website_url: employerData?.website_url || '',
      incorporation_date: employerData?.incorporation_date || '',
      cin_number: employerData?.cin_number || '',
      gst_number: employerData?.gst_number || '',
      pan_number: employerData?.pan_number || '',
      naps_establishment_id: employerData?.naps_establishment_id || '',
      esic_registration_number: employerData?.esic_registration_number || '',
      epfo_registration_number: employerData?.epfo_registration_number || '',
      official_email: userData?.email || employerData?.official_email || '',
      official_phone_number: userData?.mobile_number || employerData?.official_phone_number || phone,
      password: currentPassword || password || resumePassword || '',
      full_name: userData?.full_name || '',
      department: dept,
      registered_address: employerData?.registered_address || '',
      headquarters_city: employerData?.headquarters_city || '',
      headquarters_state: employerData?.headquarters_state || '',
      headquarters_pincode: employerData?.headquarters_pincode || '',
      headquarters_country: employerData?.headquarters_country || 'India',
      posh_compliance: employerData?.posh_compliance || 'Pending',
      maternity_policy_available: employerData?.maternity_policy_available || 'Pending',
      women_friendly_workplace: employerData?.women_friendly_workplace !== undefined ? employerData.women_friendly_workplace : true,
      gender_policy_status: employerData?.gender_policy_status || 'Pending'
    }));
  };

  const checkAndProceed = async () => {
    setError('');
    setPhoneStatus('idle');
    setLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      const checkRes = await fetch(`${API}/auth/employer/check-phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_number: cleanPhone })
      });
      const checkData = await checkRes.json();
      if (!checkRes.ok) throw new Error(checkData.error || 'Could not check number.');

      if (checkData.status === 'already_registered') {
        setPhoneStatus('already_registered');
        return;
      }

      if (checkData.status === 'pending_onboarding') {
        setPhoneStatus('pending_onboarding');
        return;
      }

      const otpRes = await fetch(`${API}/auth/employer/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_number: cleanPhone })
      });
      const otpData = await otpRes.json();
      if (!otpRes.ok) throw new Error(otpData.error || 'Could not send OTP.');
      setPhone(cleanPhone);
      setDevOtp(otpData.devOtp || '123456');
      setPhase('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resumeOnboarding = async () => {
    setError('');
    setLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      const res = await fetch(`${API}/auth/employer/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_number: cleanPhone, mobile_otp_verified: true, password: resumePassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not resume onboarding.');
      if (data.onboarding_incomplete) {
        setToken(data.token);
        setEmployer(data.employer);
        setPassword(resumePassword);
        initFormData(data.employer, data.user, resumePassword);
        setPhase('onboarding');
        return;
      }
      throw new Error('Unexpected response. Please try again.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/employer/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_number: phone, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP.');
      setOtpVerified(true);
      setPhase('password');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async () => {
    setError('');
    const passChecks = [
      password.length >= 6,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
      /[^A-Za-z0-9]/.test(password)
    ];
    const strongPassword = passChecks.every(Boolean);
    if (!strongPassword) {
      setError('Password must pass every strength check.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/employer/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_number: phone, mobile_otp_verified: otpVerified, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not create account.');

      setToken(data.token);
      setEmployer(data.employer);
      initFormData(data.employer, data.user, password);
      setPhase('onboarding');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Form State mapped to Sequelize schema
  const [formData, setFormData] = useState({
    // Step 1: Company Info
    company_name: '',
    legal_entity_name: '',
    company_type: 'Pvt Ltd', // Pvt Ltd/LLP/Public/NGO etc
    industry_sector: 'Logistics', // Logistics/E-commerce/Warehouse etc
    company_size: 'Startup', // Startup/SME/Enterprise
    website_url: '',
    incorporation_date: '',
    
    // Step 2: Compliance/Tax IDs
    cin_number: '',
    gst_number: '',
    pan_number: '',
    naps_establishment_id: '',
    esic_registration_number: '',
    epfo_registration_number: '',

    // Step 3: Contacts & Address
    official_email: '',
    official_phone_number: '',
    full_name: '',
    department: 'Administration',
    password: '',
    registered_address: '',
    location_name: '',
    location_type: 'Headquarters',
    address_line_1: '',
    address_line_2: '',
    landmark: '',
    headquarters_city: '',
    district: '',
    headquarters_state: '',
    headquarters_pincode: '',
    headquarters_country: 'India',

    // Step 4: Diversity Policies
    posh_compliance: 'Pending', // Declared/Verified/Pending
    maternity_policy_available: 'Pending', // Yes/No/Pending
    women_friendly_workplace: true,
    gender_policy_status: 'Pending'
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = uppercaseFields.has(name) ? value.toUpperCase().replace(/\s/g, '') : value;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : nextValue
    }));
  };

  const getComplianceValidationError = () => {
    for (const rule of COMPLIANCE_VALIDATIONS) {
      const value = String(formData[rule.key] || '').trim();
      if (!value && rule.required) return `${rule.label} is required.`;
      if (value && !rule.pattern.test(value)) return rule.message;
    }
    return '';
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');

    // Field validations for each step
    if (step === 1) {
      if (!formData.company_name.trim() || !formData.legal_entity_name.trim()) {
        setError('Please fill in both the Company Name and Legal Entity Name.');
        return;
      }
    } else if (step === 2) {
      const complianceError = getComplianceValidationError();
      if (complianceError) {
        setError(complianceError);
        return;
      }
    } else if (step === 3) {
      if (!formData.official_email.trim() || !formData.official_phone_number.trim() || !formData.full_name.trim() || !formData.password.trim()) {
        setError('Official Email, Phone, Contact Full Name, and Account Password are required.');
        return;
      }
    } else if (step === 4) {
      if (!formData.registered_address.trim()) {
        setError('Registered office address is required.');
        return;
      }
    }

    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/employer/complete-onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Onboarding submission failed.');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Company Profile', icon: <Building2 className="w-4 h-4" /> },
    { num: 2, label: 'Tax & Compliance', icon: <FileBadge2 className="w-4 h-4" /> },
    { num: 3, label: 'Contact Info', icon: <User className="w-4 h-4" /> },
    { num: 4, label: 'Office Address', icon: <MapPin className="w-4 h-4" /> },
    { num: 5, label: 'Diversity & Safety', icon: <Heart className="w-4 h-4" /> }
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center p-6 font-sans">
        <div className="bg-white border border-slate-200 rounded-[24px] max-w-md w-full shadow-2xl p-8 flex flex-col items-center text-center space-y-5">
          <div className="p-4 bg-amber-50 rounded-full border border-amber-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="font-extrabold text-lg text-slate-800">Application Submitted!</h3>
            <p className="text-xs leading-relaxed text-slate-500 font-normal">
              Your company profile has been securely recorded and is now <strong>pending superadmin approval</strong>.
              You will be able to log in once the Even Cargo admin team approves your registration (typically within 24 hours).
            </p>
          </div>
          <div className="w-full bg-amber-50 border border-amber-100 rounded-xl p-3 text-[11px] text-amber-700 font-semibold">
            ⏳ Your login will be activated after approval. Please check back later.
          </div>
          <button
            onClick={onCancel}
            className="w-full h-11 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-white p-4 flex items-center justify-center selection:bg-orange-100 selection:text-orange-950 font-sans">
      <div className="w-full max-w-[1100px] h-[calc(100dvh-2rem)] max-h-[620px] min-h-[520px] overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-[0_18px_46px_rgba(234,88,12,0.10)]">
        <div className="grid lg:grid-cols-[290px_1fr] h-full min-h-0">
        
        {/* SIDE BAR: WIZARD PROGRESS MAP */}
        <div className="bg-gradient-to-br from-orange-100 via-amber-100 to-orange-50 text-slate-900 p-5 flex flex-col justify-between shrink-0 border-b lg:border-b-0 lg:border-r border-orange-200">
          <div className="space-y-6 w-full">
            
            {/* Header */}
            <div className="flex items-center gap-3">
              {!logoError ? (
                <img
                  src="/logo.png"
                  onError={() => setLogoError(true)}
                  className="h-11 w-11 object-contain rounded-lg bg-white p-1 border border-orange-100"
                  alt="Even Cargo"
                />
              ) : (
                <div className="h-11 w-11 rounded-lg bg-gradient-to-tr from-[#4F7DCB] to-[#F39A42] flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-sm">
                  EC
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold"><span className="text-[#F39A42]">Even</span> <span className="text-slate-900">Cargo</span></h2>
                <p className="text-[10px] uppercase tracking-wider text-orange-500 font-semibold">Employer flow</p>
              </div>
            </div>

            {/* Stepper Steps / Info */}
            {phase === 'onboarding' ? (
              <div className="flex flex-col space-y-2 pt-4">
                <div className="h-2 rounded-full bg-orange-100 overflow-hidden">
                  <div className="h-full bg-[#F39A42]" style={{ width: `${Math.round((step / stepsList.length) * 100)}%` }} />
                </div>
                {stepsList.map((s) => {
                  const isActive = step === s.num;
                  const isCompleted = step > s.num;
                  return (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => {
                        if (isCompleted || s.num <= step) {
                          setStep(s.num);
                        }
                      }}
                      className={`w-full flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition ${
                        isActive 
                          ? 'border-orange-300 bg-[#F39A42] text-white shadow-sm shadow-orange-200' 
                          : isCompleted 
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100' 
                            : 'border-transparent text-slate-500 hover:border-orange-100 hover:bg-white hover:text-[#F39A42]'
                      }`}>
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                        isActive
                          ? 'bg-white/15 text-white'
                          : isCompleted
                            ? 'bg-white text-emerald-700'
                            : 'bg-white/70 text-slate-400'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold">{s.label}</span>
                        <span className={`mt-0.5 block text-[9px] font-bold uppercase tracking-wider ${
                          isActive ? 'text-orange-100' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                        }`}>
                          {isActive ? 'Current' : isCompleted ? 'Completed' : 'Pending'}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-8 space-y-4 text-sm text-slate-650 font-medium">
                <p className="flex gap-2 items-center"><ShieldCheck size={18} className="text-orange-500 shrink-0" /> Verify mobile with OTP</p>
                <p className="flex gap-2 items-center"><KeyRound size={18} className="text-orange-500 shrink-0" /> Set a strong password</p>
                <p className="flex gap-2 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[18px] h-[18px] text-orange-500 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.904-4.473L19.5 21L21 19.5l-4.473-8.904L21 9.813L9.813 15.904z" /></svg>
                  Complete onboarding after account creation
                </p>
              </div>
            )}

          </div>

          {/* Action to Cancel / Return */}
          <div className="pt-4 border-t border-orange-200 w-full mt-auto hidden md:block">
            <button
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </button>
          </div>

        </div>

        {/* CONTENT PANEL: FORMS */}
        <div className="min-w-0 min-h-0 flex flex-col justify-center">
          {phase !== 'onboarding' ? (
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
              {renderAuthPhase()}
            </div>
          ) : (
            <div className="flex-1 min-h-0 flex flex-col">
            
            {/* Header / Errors */}
            <div className="flex justify-between items-center border-b border-orange-100 px-6 py-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Step {step} of {stepsList.length}</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{stepsList[step - 1].label}</h3>
              </div>
              <div className="h-8 w-8 rounded-lg bg-orange-50 text-[#F39A42] flex items-center justify-center">
                {stepsList[step - 1].icon}
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Step Content */}
            <form onSubmit={step === stepsList.length ? handleSubmit : handleNext} className="flex-1 min-h-0 flex flex-col">
              <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">
              
              {/* STEP 1: Company Profile details */}
              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company name *</label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      placeholder="e.g. Even Cargo Logistics Pvt Ltd"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition placeholder:text-slate-400"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Legal entity name *</label>
                    <input
                      type="text"
                      name="legal_entity_name"
                      value={formData.legal_entity_name}
                      onChange={handleInputChange}
                      placeholder="As registered in MCA / tax documents"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition placeholder:text-slate-400"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company type</label>
                    <select
                      name="company_type"
                      value={formData.company_type}
                      onChange={handleInputChange}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    >
                      <option value="Pvt Ltd">Pvt Ltd</option>
                      <option value="LLP">LLP</option>
                      <option value="Public Ltd">Public Ltd</option>
                      <option value="Proprietorship">Proprietorship</option>
                      <option value="Partnership">Partnership</option>
                      <option value="NGO">NGO / Trust</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Industry sector</label>
                    <select
                      name="industry_sector"
                      value={formData.industry_sector}
                      onChange={handleInputChange}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    >
                      <option value="Logistics">Logistics & Supply Chain</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Warehouse">Warehousing</option>
                      <option value="Retail">Retail</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Tech">Technology / Software</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company size</label>
                    <select
                      name="company_size"
                      value={formData.company_size}
                      onChange={handleInputChange}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    >
                      <option value="Startup">Startup (&lt; 50 employees)</option>
                      <option value="SME">SME (50 - 250 employees)</option>
                      <option value="Enterprise">Enterprise (250+ employees)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Website URL</label>
                    <input
                      type="url"
                      name="website_url"
                      value={formData.website_url}
                      onChange={handleInputChange}
                      placeholder="e.g. https://company.com"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Incorporation date</label>
                    <input
                      type="date"
                      name="incorporation_date"
                      value={formData.incorporation_date}
                      onChange={handleInputChange}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Compliance & Identifiers */}
              {step === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PAN Number *</label>
                    <input
                      type="text"
                      name="pan_number"
                      value={formData.pan_number}
                      onChange={handleInputChange}
                      placeholder="10-digit Alphanumeric"
                      maxLength={10}
                      pattern="[A-Z]{5}[0-9]{4}[A-Z]"
                      title="PAN must follow the format ABCDE1234F."
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition uppercase"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GSTIN / Tax Number</label>
                    <input
                      type="text"
                      name="gst_number"
                      value={formData.gst_number}
                      onChange={handleInputChange}
                      placeholder="15-digit GST Registration"
                      maxLength={15}
                      pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]"
                      title="GSTIN must follow the format 27ABCDE1234F1Z5."
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition uppercase"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Corporate ID (CIN)</label>
                    <input
                      type="text"
                      name="cin_number"
                      value={formData.cin_number}
                      onChange={handleInputChange}
                      placeholder="21-digit CIN Number"
                      maxLength={21}
                      pattern="[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}"
                      title="CIN must follow the format U12345DL2024PTC123456."
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition uppercase"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NAPS Establishment ID</label>
                    <input
                      type="text"
                      name="naps_establishment_id"
                      value={formData.naps_establishment_id}
                      onChange={handleInputChange}
                      placeholder="NAPS Portal ID"
                      maxLength={30}
                      pattern="[A-Z0-9/-]{4,30}"
                      title="NAPS ID can use uppercase letters, numbers, slash, or hyphen."
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ESIC Registration</label>
                    <input
                      type="text"
                      name="esic_registration_number"
                      value={formData.esic_registration_number}
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, '');
                        handleInputChange(e);
                      }}
                      placeholder="ESIC ID if registered"
                      maxLength={17}
                      pattern="[0-9]{17}"
                      title="ESIC Registration must be exactly 17 digits."
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">EPFO Registration</label>
                    <input
                      type="text"
                      name="epfo_registration_number"
                      value={formData.epfo_registration_number}
                      onChange={handleInputChange}
                      placeholder="EPF Registration ID"
                      maxLength={30}
                      pattern="[A-Z0-9/-]{5,30}"
                      title="EPFO ID can use uppercase letters, numbers, slash, or hyphen."
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Contact Info */}
              {step === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official email *</label>
                    <input
                      type="email"
                      name="official_email"
                      value={formData.official_email}
                      onChange={handleInputChange}
                      placeholder="e.g. logistics@company.com"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official phone number *</label>
                    <input
                      type="tel"
                      name="official_phone_number"
                      value={formData.official_phone_number}
                      readOnly
                      placeholder="Mobile / Landline"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed px-3.5 text-xs outline-none"
                      required
                    />
                    <p className="text-[9px] text-slate-400 font-medium pl-0.5">Verified number (non-editable)</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Full Name *</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Your Full Name"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      readOnly
                      placeholder="Minimum 6 characters"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed px-3.5 text-xs outline-none"
                      required
                    />
                    <p className="text-[9px] text-slate-400 font-medium pl-0.5">Registered account password (non-editable)</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Admin department</label>
                    <select
                      value={customDepartment ? 'custom_other' : (['Human Resources (HR)', 'Administration', 'Operations', 'Logistics / Supply Chain', 'Training / L&D', 'Finance / Legal'].includes(formData.department) ? formData.department : (formData.department ? 'custom_other' : ''))}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'custom_other') {
                          setCustomDepartment(true);
                          setFormData(prev => ({ ...prev, department: '' }));
                        } else {
                          setCustomDepartment(false);
                          setFormData(prev => ({ ...prev, department: val }));
                        }
                      }}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    >
                      <option value="">Select Department</option>
                      <option value="Human Resources (HR)">Human Resources (HR)</option>
                      <option value="Administration">Administration</option>
                      <option value="Operations">Operations</option>
                      <option value="Logistics / Supply Chain">Logistics / Supply Chain</option>
                      <option value="Training / L&D">Training / L&D</option>
                      <option value="Finance / Legal">Finance / Legal</option>
                      <option value="custom_other">Other (Type manually)</option>
                    </select>
                    {customDepartment && (
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="Enter custom department name"
                        className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 mt-2 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                        required
                      />
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: Registered Office Address */}
              {step === 4 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered office address *</label>
                    <textarea
                      name="registered_address"
                      value={formData.registered_address}
                      onChange={handleInputChange}
                      placeholder="Full official company address"
                      rows={2}
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition resize-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location name</label>
                    <select
                      value={customLocationName ? 'custom_other' : (['Main Head Office', 'Corporate Office', 'Registered Office', 'Warehouse HQ', 'Branch Office'].includes(formData.location_name) ? formData.location_name : (formData.location_name ? 'custom_other' : ''))}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'custom_other') {
                          setCustomLocationName(true);
                          setFormData(prev => ({ ...prev, location_name: '' }));
                        } else {
                          setCustomLocationName(false);
                          setFormData(prev => ({ ...prev, location_name: val }));
                        }
                      }}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    >
                      <option value="">Select Location Name</option>
                      <option value="Main Head Office">Main Head Office</option>
                      <option value="Corporate Office">Corporate Office</option>
                      <option value="Registered Office">Registered Office</option>
                      <option value="Warehouse HQ">Warehouse HQ</option>
                      <option value="Branch Office">Branch Office</option>
                      <option value="custom_other">Other (Type manually)</option>
                    </select>
                    {customLocationName && (
                      <input
                        type="text"
                        name="location_name"
                        value={formData.location_name}
                        onChange={handleInputChange}
                        placeholder="Enter custom location name"
                        className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 mt-2 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                        required
                      />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location type</label>
                    <select
                      name="location_type"
                      value={formData.location_type}
                      onChange={handleInputChange}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    >
                      <option value="Headquarters">Headquarters</option>
                      <option value="Branch">Branch</option>
                      <option value="Warehouse">Warehouse</option>
                      <option value="Factory">Factory</option>
                      <option value="Training Center">Training Center</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Address line 1</label>
                    <input
                      type="text"
                      name="address_line_1"
                      value={formData.address_line_1}
                      onChange={handleInputChange}
                      placeholder="Building / street"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Address line 2</label>
                    <input
                      type="text"
                      name="address_line_2"
                      value={formData.address_line_2}
                      onChange={handleInputChange}
                      placeholder="Area / locality"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Landmark</label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      placeholder="Nearby landmark"
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">HQ State</label>
                    <select
                      name="headquarters_state"
                      value={formData.headquarters_state}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomDistrict(false);
                        setCustomCity(false);
                        setFormData(prev => ({
                          ...prev,
                          headquarters_state: val,
                          district: '',
                          headquarters_city: ''
                        }));
                      }}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    >
                      <option value="">Select State / UT</option>
                      {INDIA_STATES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">District</label>
                    <select
                      value={customDistrict ? 'custom_other' : formData.district}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'custom_other') {
                          setCustomDistrict(true);
                          setFormData(prev => ({ ...prev, district: '' }));
                        } else {
                          setCustomDistrict(false);
                          setFormData(prev => ({ ...prev, district: val }));
                        }
                      }}
                      disabled={!formData.headquarters_state}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    >
                      <option value="">Select District</option>
                      {formData.headquarters_state && (INDIA_STATES_DATA[formData.headquarters_state]?.districts || []).map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                      {formData.headquarters_state && <option value="custom_other">Other (Type manually)</option>}
                    </select>
                    {customDistrict && (
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        placeholder="Enter custom district name"
                        className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 mt-2 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                        required
                      />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">HQ City</label>
                    <select
                      value={customCity ? 'custom_other' : formData.headquarters_city}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'custom_other') {
                          setCustomCity(true);
                          setFormData(prev => ({ ...prev, headquarters_city: '' }));
                        } else {
                          setCustomCity(false);
                          setFormData(prev => ({ ...prev, headquarters_city: val }));
                        }
                      }}
                      disabled={!formData.headquarters_state}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    >
                      <option value="">Select City / Town</option>
                      {formData.headquarters_state && (INDIA_STATES_DATA[formData.headquarters_state]?.cities || []).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      {formData.headquarters_state && <option value="custom_other">Other (Type manually)</option>}
                    </select>
                    {customCity && (
                      <input
                        type="text"
                        name="headquarters_city"
                        value={formData.headquarters_city}
                        onChange={handleInputChange}
                        placeholder="Enter custom city name"
                        className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 mt-2 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                        required
                      />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">HQ Postal pincode</label>
                    <input
                      type="text"
                      name="headquarters_pincode"
                      value={formData.headquarters_pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit Pincode"
                      maxLength={6}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">HQ Country</label>
                    <select
                      name="headquarters_country"
                      value={formData.headquarters_country}
                      onChange={handleInputChange}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                    >
                      <option value="India">India</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 5: Diversity & Policy Flags */}
              {step === 5 && (
                <div className="space-y-5">
                  <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-2xl flex items-start gap-3">
                    <Info className="w-4 h-4 text-[#F39A42] shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed text-slate-655 font-normal">
                      Even Cargo prioritizes partnerships with organizations dedicated to safe, women-friendly operational environments. Please indicate your current policies below.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">POSH Compliance Status</label>
                      <select
                        name="posh_compliance"
                        value={formData.posh_compliance}
                        onChange={handleInputChange}
                        className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                      >
                        <option value="Yes">Yes, compliant</option>
                        <option value="Pending">Process Initiated / Pending</option>
                        <option value="No">No policy currently</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Maternity Policy Available</label>
                      <select
                        name="maternity_policy_available"
                        value={formData.maternity_policy_available}
                        onChange={handleInputChange}
                        className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                      >
                        <option value="Yes">Yes, policy active</option>
                        <option value="Pending">Under Review / Draft</option>
                        <option value="No">No maternity policy</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gender Equality / Diversity policy</label>
                      <select
                        name="gender_policy_status"
                        value={formData.gender_policy_status}
                        onChange={handleInputChange}
                        className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-700 outline-none focus:border-[#F39A42] transition"
                      >
                        <option value="Yes">Declared / Active</option>
                        <option value="Pending">Drafting / Pending approval</option>
                        <option value="No">No active policy</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl h-11 select-none">
                      <span className="text-xs font-semibold text-slate-700">Women-friendly Workplace?</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="women_friendly_workplace"
                          checked={formData.women_friendly_workplace}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              </div>

              {/* Wizard navigation Buttons */}
              <div className="border-t border-orange-100 bg-white px-6 py-4 flex flex-wrap items-center justify-between gap-3 select-none">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="h-11 px-5 border border-slate-250 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition cursor-pointer text-xs flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="h-11 px-5 border border-slate-250 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition cursor-pointer text-xs flex items-center gap-1.5 md:hidden"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 px-6 ml-auto bg-gradient-to-r from-orange-500 to-[#F39A42] text-white font-bold rounded-xl transition cursor-pointer text-xs flex items-center gap-1.5 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : step === stepsList.length ? (
                    <>
                      <span>Submit Profile</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        )}

        </div>

        </div>
      </div>
    </div>
  );
}
