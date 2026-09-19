import React, { useState, useEffect } from 'react';
import {
  Building2,
  Briefcase,
  PlusCircle,
  Users,
  Search,
  RotateCw,
  Eye,
  ChevronRight,
  Filter,
  X,
  Sparkles,
  Zap,
  DollarSign,
  Calendar,
  Layers,
  MapPin,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  Car,
  CheckCircle2,
  Check,
  Clock,
  ArrowRight,
  FileSpreadsheet,
  Send,
  Building,
  ExternalLink,
  ChevronDown,
  BatteryCharging,
  TrendingUp
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function EmployerManagement({ placementUser, onSectionChange, initialTab = 'employers' }) {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab); // 'employers' | 'roles' | 'hubs'

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Modals state
  const [showAddEmployerModal, setShowAddEmployerModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [selectedEmployerForRole, setSelectedEmployerForRole] = useState('');

  const ALL_PERKS_OPTIONS = [
    'Accidental Insurance ₹5 Lakhs',
    '100% Employer Provided EV',
    'Unlimited Free Battery Swaps',
    'Safety Gear & Helmet Kit',
    'Rain Gear & Waterproof Bag',
    'Weekly Direct Bank Payout Cycle',
    'Subsidized Canteen Meals',
    'Mobile Data Allowance ₹500/mo',
    'Quarterly Retention Bonus ₹5,000'
  ];

  // Add Employer Form State
  const [newEmployerName, setNewEmployerName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [newCinGstin, setNewCinGstin] = useState('U74999KA2022PTC128491 / 29AABCE1284P1Z4');
  const [newIndustry, setNewIndustry] = useState('Quick Commerce EV Logistics');
  const [newCategory, setNewCategory] = useState('QUICK_COMMERCE');
  const [newPrimaryCity, setNewPrimaryCity] = useState('Bengaluru');
  const [newRegisteredAddress, setNewRegisteredAddress] = useState('Sector 4, Main Commercial Boulevard, Koramangala, Bengaluru, Karnataka 560034');
  const [newMouSigned, setNewMouSigned] = useState(true);
  
  // Hub Details for New Employer
  const [newHubName, setNewHubName] = useState('Central Dark Store & Charging Hub');
  const [newHubAddress, setNewHubAddress] = useState('Plot 24, Outer Ring Rd, Koramangala, Bengaluru');
  const [newHubCapacity, setNewHubCapacity] = useState('50');
  const [newHubChargingPoints, setNewHubChargingPoints] = useState('20');
  
  // EV Vehicle & Policy
  const [newVehicleModel, setNewVehicleModel] = useState('Ather 450X Commercial Spec');
  const [newVehiclePolicy, setNewVehiclePolicy] = useState('100% Employer Provided EV with Zero Fuel & Swap Cost');

  // Contact Person Details
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newContactDesignation, setNewContactDesignation] = useState('Regional Talent Acquisition & Operations Lead');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  // Initial Role for New Employer
  const [newInitialRole, setNewInitialRole] = useState('EV Delivery Pilot');
  const [newInitialVacancies, setNewInitialVacancies] = useState('25');
  const [newInitialSalary, setNewInitialSalary] = useState('21500');
  const [newInitialShift, setNewInitialShift] = useState('08:00 AM - 04:30 PM (Day Shift)');
  const [newInitialTier, setNewInitialTier] = useState('NF1 / NF2');
  const [newInitialQualification, setNewInitialQualification] = useState('10th Standard Pass, Basic Android Smartphone literacy, Learner or Permanent DL');
  const [newInitialPerks, setNewInitialPerks] = useState([
    'Accidental Insurance ₹5 Lakhs',
    '100% Employer Provided EV',
    'Unlimited Free Battery Swaps',
    'Weekly Direct Bank Payout Cycle'
  ]);

  // Add Role Form State
  const [targetEmployerId, setTargetEmployerId] = useState('');
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleVacancies, setNewRoleVacancies] = useState('15');
  const [newRoleSalary, setNewRoleSalary] = useState('21000');
  const [newRoleShift, setNewRoleShift] = useState('08:00 AM - 04:30 PM (Day Shift)');
  const [newRoleWorkType, setNewRoleWorkType] = useState('Full-Time');
  const [newRoleDeliveryRadius, setNewRoleDeliveryRadius] = useState('4.5');
  const [newRoleHub, setNewRoleHub] = useState('Indiranagar 100ft Hub');
  const [newRoleEduLevel, setNewRoleEduLevel] = useState('10th Standard Pass');
  const [newRoleDLReq, setNewRoleDLReq] = useState('Learner or Permanent 2W DL');
  const [newRolePreferredTier, setNewRolePreferredTier] = useState('NF1 / NF2');
  const [newRolePayoutCycle, setNewRolePayoutCycle] = useState('Weekly Direct Bank Transfer');
  const [newRoleWorkingDays, setNewRoleWorkingDays] = useState('6 Days / Week (1 Rostered Off)');
  const [newRoleQualification, setNewRoleQualification] = useState('10th Standard Pass, Basic Android Smartphone usage, Learner or Permanent DL');
  const [newRolePerks, setNewRolePerks] = useState([
    'Accidental Insurance ₹5 Lakhs',
    '100% Employer Provided EV',
    'Unlimited Free Battery Swaps',
    'Safety Gear & Helmet Kit'
  ]);

  const toggleInitialPerk = (perk) => {
    if (newInitialPerks.includes(perk)) {
      setNewInitialPerks(newInitialPerks.filter(p => p !== perk));
    } else {
      setNewInitialPerks([...newInitialPerks, perk]);
    }
  };

  const toggleRolePerk = (perk) => {
    if (newRolePerks.includes(perk)) {
      setNewRolePerks(newRolePerks.filter(p => p !== perk));
    } else {
      setNewRolePerks([...newRolePerks, perk]);
    }
  };

  const [toastMessage, setToastMessage] = useState('');

  // Fallback initial dataset
  const fallbackEmployers = [
    {
      id: 'emp-01',
      employer_name: 'Zomato Green Fleet',
      company_code: 'EMP-ZOM-01',
      industry: 'Hyperlocal Food Logistics',
      category: 'QUICK_COMMERCE',
      is_green_employer: true,
      logo_url: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=120&auto=format&fit=crop&q=80',
      primary_city: 'Bengaluru',
      operating_cities: ['Bengaluru', 'Delhi NCR', 'Hyderabad', 'Mumbai'],
      mou_signed: true,
      status: 'ACTIVE',
      contact_person: 'Ananya Deshmukh',
      contact_designation: 'Head of Green Fleet Operations',
      contact_email: 'ananya.deshmukh@zomato-green.com',
      contact_phone: '+91 98765 44001',
      hubs: [
        { name: 'Koramangala 4th Block Hub', address: 'Plot 18, 80ft Rd, Koramangala 4th Block, Bengaluru', capacity: 60, charging_points: 24 },
        { name: 'Indiranagar 100ft Hub', address: '142, 100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru', capacity: 45, charging_points: 18 }
      ],
      vehicle_policy: 'EMPLOYER_PROVIDED_EV',
      allocated_ev_model: 'Ather 450X Commercial Spec',
      active_roles: [
        {
          id: 'role-zom-01',
          job_title: 'EV Last-Mile Delivery Pilot',
          role_code: 'ZOM-PILOT-01',
          vacancies: 35,
          placed_count: 20,
          monthly_gross_salary: 21500,
          base_pay: 16000,
          performance_bonus: 5500,
          shift_timings: '08:00 AM - 04:30 PM (Day Shift)',
          work_type: 'Full-Time',
          delivery_radius_km: 5.5,
          required_qualification: '10th Standard Pass, Basic Android Smartphone usage, Learner or Permanent DL',
          preferred_nf_tier: 'NF1 / NF2',
          perks: ['Accidental Insurance ₹5 Lakhs', 'Unlimited Battery Swaps', 'Safety Gear Kit', 'Weekly Payout Cycle'],
          status: 'OPEN'
        },
        {
          id: 'role-zom-02',
          job_title: 'Senior Hub EV Fleet Captain',
          role_code: 'ZOM-CAPT-02',
          vacancies: 10,
          placed_count: 6,
          monthly_gross_salary: 24500,
          base_pay: 18500,
          performance_bonus: 6000,
          shift_timings: '12:00 PM - 08:30 PM (Evening Peak)',
          work_type: 'Full-Time',
          delivery_radius_km: 7.0,
          required_qualification: 'Permanent 2W Driving License, Minimum 6 months riding experience',
          preferred_nf_tier: 'NF1',
          perks: ['Quarterly Retention Bonus ₹6,000', 'Hub Leadership Track', 'Medical OPD Allowance'],
          status: 'OPEN'
        }
      ],
      total_placed_candidates: 26
    },
    {
      id: 'emp-02',
      employer_name: 'BigBasket Electric (BB Now)',
      company_code: 'EMP-BB-02',
      industry: 'Quick Commerce EV Grocery Logistics',
      category: 'QUICK_COMMERCE',
      is_green_employer: true,
      logo_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80',
      primary_city: 'Bengaluru',
      operating_cities: ['Bengaluru', 'Chennai', 'Pune'],
      mou_signed: true,
      status: 'ACTIVE',
      contact_person: 'Vikram Sethi',
      contact_designation: 'Talent Acquisition & Diversity Lead',
      contact_email: 'vikram.sethi@bigbasket.com',
      contact_phone: '+91 98765 44002',
      hubs: [
        { name: 'BTM 2nd Stage Dark Store', address: '12, 16th Main, BTM 2nd Stage, Bengaluru', capacity: 50, charging_points: 20 },
        { name: 'Whitefield EPIP Hub', address: 'Plot 4, EPIP Zone, Whitefield, Bengaluru', capacity: 40, charging_points: 15 }
      ],
      vehicle_policy: 'EMPLOYER_PROVIDED_EV',
      allocated_ev_model: 'Hero Electric Nyx Heavy Cargo',
      active_roles: [
        {
          id: 'role-bb-01',
          job_title: 'Express Dark Store EV Pilot',
          role_code: 'BB-DARK-01',
          vacancies: 40,
          placed_count: 28,
          monthly_gross_salary: 19800,
          base_pay: 15000,
          performance_bonus: 4800,
          shift_timings: '07:00 AM - 03:30 PM (Morning Express)',
          work_type: 'Full-Time',
          delivery_radius_km: 3.5,
          required_qualification: '8th Standard Pass, Basic reading skills, Learner DL accepted',
          preferred_nf_tier: 'NF1 / NF2 / NF3',
          perks: ['Subsidized Canteen Meals', 'Zero Security Deposit', 'Festival Bonus', 'Grocery Discount Pass'],
          status: 'OPEN'
        }
      ],
      total_placed_candidates: 28
    },
    {
      id: 'emp-03',
      employer_name: 'Blinkit Smart Logistics',
      company_code: 'EMP-BLK-03',
      industry: 'Instant Delivery & Supply Logistics',
      category: 'INSTANT_DELIVERY',
      is_green_employer: true,
      logo_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=120&auto=format&fit=crop&q=80',
      primary_city: 'Bengaluru',
      operating_cities: ['Bengaluru', 'Delhi NCR', 'Kolkata'],
      mou_signed: true,
      status: 'ACTIVE',
      contact_person: 'Sneha Roy',
      contact_designation: 'Operations Regional Manager',
      contact_email: 'sneha.roy@blinkit.com',
      contact_phone: '+91 98765 44003',
      hubs: [
        { name: 'HSR Layout Sector 1 Hub', address: '27th Main Rd, Sector 1, HSR Layout, Bengaluru', capacity: 35, charging_points: 12 }
      ],
      vehicle_policy: 'EMPLOYER_PROVIDED_EV',
      allocated_ev_model: 'TVS iQube Commercial Cargo',
      active_roles: [
        {
          id: 'role-blk-01',
          job_title: 'Hub Dispatch & Delivery Associate',
          role_code: 'BLK-DISP-01',
          vacancies: 25,
          placed_count: 15,
          monthly_gross_salary: 18500,
          base_pay: 14500,
          performance_bonus: 4000,
          shift_timings: '09:00 AM - 05:30 PM (Regular Day)',
          work_type: 'Full-Time',
          delivery_radius_km: 3.0,
          required_qualification: '10th Standard Pass, Smartphone Literacy',
          preferred_nf_tier: 'NF2 / NF3',
          perks: ['Health Insurance Coverage', 'Free Uniform & Rain Kit', 'On-time Direct Bank Credit'],
          status: 'OPEN'
        }
      ],
      total_placed_candidates: 15
    },
    {
      id: 'emp-04',
      employer_name: 'Uber Green Mobility',
      company_code: 'EMP-UBR-04',
      industry: 'Clean Urban Ride Hailing',
      category: 'RIDE_HAILING',
      is_green_employer: true,
      logo_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=120&auto=format&fit=crop&q=80',
      primary_city: 'Bengaluru',
      operating_cities: ['Bengaluru', 'Delhi', 'Mumbai'],
      mou_signed: true,
      status: 'ACTIVE',
      contact_person: 'Rohan Deshmukh',
      contact_designation: 'EV Fleet Partnership Director',
      contact_email: 'rohan.d@uber-green.org',
      contact_phone: '+91 98765 44004',
      hubs: [
        { name: 'KIAL Clean Airport Hub', address: 'Terminal 1 Dedicated EV Bay, Kempegowda Intl Airport, Bengaluru', capacity: 50, charging_points: 30 }
      ],
      vehicle_policy: 'EMPLOYER_PROVIDED_EV',
      allocated_ev_model: 'BluSmart / Tata Tigor EV',
      active_roles: [
        {
          id: 'role-ubr-01',
          job_title: 'Women EV Ride Fleet Captain',
          role_code: 'UBR-CAPT-01',
          vacancies: 20,
          placed_count: 10,
          monthly_gross_salary: 24000,
          base_pay: 19000,
          performance_bonus: 5000,
          shift_timings: 'Flexible (Airport Corridor)',
          work_type: 'Full-Time',
          delivery_radius_km: 15.0,
          required_qualification: 'Permanent 4W/LMV Commercial License, 1 year driving experience',
          preferred_nf_tier: 'NF1',
          perks: ['Safe Commute Escort', 'Health Shield Insurance', 'Weekly Incentive Bonus'],
          status: 'OPEN'
        }
      ],
      total_placed_candidates: 10
    }
  ];

  // Fetch from backend API
  const fetchEmployers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/employers`);
      if (res.ok) {
        const data = await res.json();
        if (data.employers && data.employers.length > 0) {
          setEmployers(data.employers);
        } else {
          setEmployers(fallbackEmployers);
        }
      } else {
        setEmployers(fallbackEmployers);
      }
    } catch (err) {
      console.warn('Backend API offline, using fallback employers:', err);
      setEmployers(fallbackEmployers);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchEmployers();
  };

  const handleCreateEmployerSubmit = async (e) => {
    e.preventDefault();
    try {
      const grossSalary = parseInt(newInitialSalary) || 21500;
      const basePay = Math.round(grossSalary * 0.75);
      const bonusPay = grossSalary - basePay;
      const codePrefix = (newEmployerName.trim() ? newEmployerName.substring(0, 3) : 'EMP').toUpperCase();

      const newLocalEmployer = {
        id: `emp-${Date.now()}`,
        employer_name: newEmployerName,
        brand_name: newBrandName || newEmployerName,
        cin_gstin: newCinGstin,
        company_code: `EMP-${codePrefix}-${Math.floor(10 + Math.random() * 90)}`,
        industry: newIndustry,
        category: newCategory,
        is_green_employer: true,
        logo_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80',
        primary_city: newPrimaryCity,
        operating_cities: [newPrimaryCity],
        registered_address: newRegisteredAddress,
        mou_signed: newMouSigned,
        mou_date: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
        contact_person: newContactPerson,
        contact_designation: newContactDesignation,
        contact_email: newContactEmail,
        contact_phone: newContactPhone,
        hubs: [
          {
            name: newHubName || `${newPrimaryCity} Main Central Hub`,
            address: newHubAddress || `Sector 4, Central Commercial Area, ${newPrimaryCity}`,
            capacity: parseInt(newHubCapacity) || 50,
            charging_points: parseInt(newHubChargingPoints) || 20
          }
        ],
        vehicle_policy: newVehiclePolicy,
        allocated_ev_model: newVehicleModel,
        active_roles: [
          {
            id: `role-${Date.now()}`,
            job_title: newInitialRole,
            role_code: `${codePrefix}-01`,
            vacancies: parseInt(newInitialVacancies) || 10,
            placed_count: 0,
            monthly_gross_salary: grossSalary,
            base_pay: basePay,
            performance_bonus: bonusPay,
            shift_timings: newInitialShift,
            work_type: 'Full-Time',
            delivery_radius_km: 5.0,
            required_qualification: newInitialQualification,
            preferred_nf_tier: newInitialTier,
            perks: newInitialPerks,
            status: 'OPEN'
          }
        ],
        total_placed_candidates: 0,
        created_at: new Date().toISOString()
      };

      try {
        await fetch(`${API_BASE}/employers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newLocalEmployer)
        });
      } catch (apiErr) {
        console.warn('API backend error, updating local state:', apiErr);
      }

      setEmployers([newLocalEmployer, ...employers]);
      setShowAddEmployerModal(false);
      setToastMessage(`Employer partner "${newEmployerName}" successfully onboarded with ${newInitialVacancies} live openings!`);
      setTimeout(() => setToastMessage(''), 4000);
      
      // Reset form
      setNewEmployerName('');
      setNewBrandName('');
      setNewContactPerson('');
      setNewContactEmail('');
      setNewContactPhone('');
    } catch (err) {
      console.error('Error creating employer:', err);
    }
  };

  const handleAddJobRoleSubmit = async (e) => {
    e.preventDefault();
    try {
      const employerId = targetEmployerId || (employers[0] ? employers[0].id : 'emp-01');
      const grossSalary = parseInt(newRoleSalary) || 21000;
      const basePay = Math.round(grossSalary * 0.75);
      const bonusPay = grossSalary - basePay;
      const targetEmp = employers.find(e => e.id === employerId);
      const codePrefix = targetEmp ? targetEmp.company_code.replace('EMP-', '') : 'ROL';

      const newRoleObj = {
        id: `role-${Date.now()}`,
        job_title: newRoleTitle,
        role_code: `${codePrefix}-${Math.floor(100 + Math.random() * 900)}`,
        vacancies: parseInt(newRoleVacancies) || 10,
        placed_count: 0,
        monthly_gross_salary: grossSalary,
        base_pay: basePay,
        performance_bonus: bonusPay,
        payout_cycle: newRolePayoutCycle,
        shift_timings: newRoleShift,
        working_days: newRoleWorkingDays,
        work_type: newRoleWorkType,
        delivery_radius_km: parseFloat(newRoleDeliveryRadius) || 4.5,
        hub_location: newRoleHub,
        required_qualification: `${newRoleEduLevel}, ${newRoleDLReq}. ${newRoleQualification}`,
        preferred_nf_tier: newRolePreferredTier,
        perks: newRolePerks,
        status: 'OPEN'
      };

      try {
        await fetch(`${API_BASE}/employers/${employerId}/roles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRoleObj)
        });
      } catch (apiErr) {
        console.warn('API backend error, updating local state:', apiErr);
      }

      setEmployers(prev =>
        prev.map(emp => {
          if (emp.id === employerId) {
            return {
              ...emp,
              active_roles: [newRoleObj, ...(emp.active_roles || [])]
            };
          }
          return emp;
        })
      );

      if (selectedEmployer && selectedEmployer.id === employerId) {
        setSelectedEmployer(prev => ({
          ...prev,
          active_roles: [newRoleObj, ...(prev.active_roles || [])]
        }));
      }

      setShowAddRoleModal(false);
      setToastMessage(`Job opening "${newRoleTitle}" with ${newRoleVacancies} vacancies posted successfully!`);
      setTimeout(() => setToastMessage(''), 4000);
      setNewRoleTitle('');
    } catch (err) {
      console.error('Error adding job role:', err);
    }
  };

  const filteredEmployers = employers.filter(e => {
    const matchSearch =
      e.employer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.primary_city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.active_roles?.some(r => r.job_title.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCategory = selectedCategory === 'ALL' || e.category === selectedCategory;
    const matchCity = selectedCity === 'ALL' || e.primary_city === selectedCity;
    return matchSearch && matchCategory && matchCity;
  });

  // Extract all roles for the roles tab
  const allJobRoles = employers.flatMap(e =>
    (e.active_roles || []).map(r => ({
      ...r,
      employer_name: e.employer_name,
      employer_code: e.company_code,
      employer_logo: e.logo_url,
      primary_city: e.primary_city,
      vehicle_model: e.allocated_ev_model
    }))
  );

  const totalLiveVacancies = allJobRoles.reduce((sum, r) => sum + (r.vacancies - r.placed_count), 0);
  const totalPlacedCount = employers.reduce((sum, e) => sum + (e.total_placed_candidates || 0), 0);

  // Helper function for Company Initials / Fallback Logo
  const getCompanyInitials = (name) => {
    if (!name) return 'EP';
    const words = name.split(' ');
    if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 pb-20 font-sans max-w-[1600px] mx-auto text-slate-800">
      
      {/* ─── Header & Action Toolbar (100% White Light Theme) ──────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="space-y-1.5 relative z-10 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              PLACEMENT & EMPLOYER HUB
            </span>
            <span className="text-slate-400 text-xs font-medium">• Commercial EV Fleet Hiring Partnerships</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            Hiring Employers & Job Opportunities
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Register corporate EV fleet partners, configure verified pilot designations, guarantee wage structures, and allocate hyper-local delivery charging hubs.
          </p>
        </div>

        {/* Action Buttons - Fixed in a single unified row */}
        <div className="flex items-center gap-2.5 relative z-10 shrink-0 flex-nowrap overflow-x-auto pb-1 lg:pb-0">
          <button
            onClick={handleRefresh}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition flex items-center gap-2 whitespace-nowrap shrink-0 shadow-2xs"
            title="Refresh Employers"
          >
            <RotateCw className={`w-3.5 h-3.5 text-emerald-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Employers</span>
          </button>

          <button
            onClick={() => {
              if (employers.length > 0) setTargetEmployerId(employers[0].id);
              setShowAddRoleModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition flex items-center gap-2 whitespace-nowrap shrink-0 shadow-2xs"
          >
            <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
            <span>Post New Job Role</span>
          </button>

          <button
            onClick={() => setShowAddEmployerModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 transition flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Employer Partner</span>
          </button>
        </div>
      </div>

      {/* Success Notification Toast */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-sm flex items-center justify-between text-xs font-bold animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="text-emerald-700 hover:text-emerald-900 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── 1. KPI Metric Summary Cards (Clean Elevated White) ────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Total Employers */}
        <div className="p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">EMPLOYER PARTNERS</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{employers.length} Active</div>
            <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">100% Green Fleets (MOU Signed)</div>
          </div>
        </div>

        {/* Live Job Openings */}
        <div className="p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">LIVE VACANCIES</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-indigo-900">
              {totalLiveVacancies} Openings
            </div>
            <div className="text-[11px] font-semibold text-indigo-600 mt-0.5">Across {allJobRoles.length} Job Roles</div>
          </div>
        </div>

        {/* Average Guaranteed Wage */}
        <div className="p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-teal-300 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AVG MONTHLY SALARY</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-teal-700">₹21,100 / mo</div>
            <div className="text-[11px] font-semibold text-teal-600 mt-0.5">Base + EV Performance Incentives</div>
          </div>
        </div>

        {/* Total Placed Pilots */}
        <div className="p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-purple-300 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CANDIDATES PLACED</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-purple-700">
              {totalPlacedCount} Placed
            </div>
            <div className="text-[11px] font-semibold text-purple-600 mt-0.5">Active in Commercial Delivery</div>
          </div>
        </div>

        {/* EV Vehicle Asset Policy */}
        <div className="p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">EV VEHICLE SUPPORT</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-blue-900">100% EV</div>
            <div className="text-[11px] font-semibold text-blue-600 mt-0.5">Employer Provided (Zero Petrol Cost)</div>
          </div>
        </div>

      </div>

      {/* ─── 2. Main Navigation Tabs ───────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('employers')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'employers'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Hiring Employer Partners</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
            {filteredEmployers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'roles'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
          <span>All Live Job Openings Directory</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-slate-100 text-slate-700">
            {allJobRoles.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('hubs')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'hubs'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Operating Hubs & Charging Infrastructure</span>
        </button>
      </div>

      {/* ─── 3. TAB 1: Employer Partners Table (Row Format) ─────────────────── */}
      {activeTab === 'employers' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search employer name, code, industry, job roles..."
                className="w-full pl-9.5 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="ALL">All Categories</option>
                <option value="QUICK_COMMERCE">Quick Commerce / Food</option>
                <option value="INSTANT_DELIVERY">Instant Delivery</option>
                <option value="RIDE_HAILING">Ride Hailing Fleet</option>
              </select>

              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="ALL">All Cities</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Mumbai">Mumbai</option>
              </select>

              {(searchQuery || selectedCategory !== 'ALL' || selectedCity !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('ALL');
                    setSelectedCity('ALL');
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

          </div>

          {/* Structured Row / Tabular Display - Concise & Clean */}
          {filteredEmployers.length === 0 ? (
            <div className="bg-white rounded-3xl p-14 text-center border border-slate-200 space-y-3 shadow-xs">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Employer Partners Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No employer partners matched the selected filters. Click "Add New Employer Partner" to onboard one.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                      <th className="py-4.5 px-6">EMPLOYER PARTNER</th>
                      <th className="py-4.5 px-6">CITY / HUB</th>
                      <th className="py-4.5 px-6">OPEN VACANCIES</th>
                      <th className="py-4.5 px-6">GUARANTEED WAGE</th>
                      <th className="py-4.5 px-6">STATUS</th>
                      <th className="py-4.5 px-6 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/90">
                    {filteredEmployers.map(item => {
                      const totalOpen = (item.active_roles || []).reduce((sum, r) => sum + (r.vacancies - r.placed_count), 0);
                      const salaries = (item.active_roles || []).map(r => r.monthly_gross_salary);
                      const minSalary = salaries.length > 0 ? Math.min(...salaries) : 20000;
                      const maxSalary = salaries.length > 0 ? Math.max(...salaries) : 20000;

                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedEmployer(item)}
                          className={`hover:bg-slate-50/70 transition-colors cursor-pointer group ${
                            selectedEmployer?.id === item.id ? 'bg-emerald-50/40' : ''
                          }`}
                        >
                          
                          {/* 1. Employer Name with Clean Fallback Avatar */}
                          <td className="py-4.5 px-6 align-middle">
                            <div className="flex items-center gap-3.5">
                              <div className="w-10 h-10 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs shrink-0 flex items-center justify-center font-black text-slate-700 text-xs">
                                {item.logo_url ? (
                                  <img
                                    src={item.logo_url}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <span>{getCompanyInitials(item.employer_name)}</span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition flex items-center gap-2 text-sm whitespace-nowrap">
                                  <span>{item.employer_name}</span>
                                  {item.mou_signed && (
                                    <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                                      MOU Signed
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                                  {item.company_code}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. City / Location */}
                          <td className="py-4.5 px-6 align-middle">
                            <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 whitespace-nowrap">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{item.primary_city}</span>
                            </div>
                          </td>

                          {/* 3. Open Vacancies */}
                          <td className="py-4.5 px-6 align-middle">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100/80 font-bold text-xs whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                              <span>{totalOpen} Openings</span>
                            </div>
                          </td>

                          {/* 4. Guaranteed Wage */}
                          <td className="py-4.5 px-6 align-middle">
                            <div className="font-extrabold text-slate-900 text-xs whitespace-nowrap">
                              {minSalary === maxSalary
                                ? `₹${minSalary.toLocaleString('en-IN')}`
                                : `₹${minSalary.toLocaleString('en-IN')} - ₹${maxSalary.toLocaleString('en-IN')}`}
                              <span className="text-[11px] font-normal text-slate-400 ml-1">/mo</span>
                            </div>
                          </td>

                          {/* 5. Status */}
                          <td className="py-4.5 px-6 align-middle">
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                              ACTIVE PARTNER
                            </span>
                          </td>

                          {/* 6. Action Button */}
                          <td className="py-4.5 px-6 text-right align-middle" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => setSelectedEmployer(item)}
                              className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 text-slate-700 font-bold text-xs transition-all inline-flex items-center gap-1.5 shadow-2xs group-hover:bg-white whitespace-nowrap"
                            >
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              <span>View Details</span>
                              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ─── 4. TAB 2: All Live Job Openings Directory ──────────────────────── */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
            {allJobRoles.map((role, idx) => (
              <div key={idx} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-indigo-300 hover:shadow-md transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs overflow-hidden shrink-0">
                      {role.employer_logo ? (
                        <img src={role.employer_logo} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                      ) : (
                        <span>{getCompanyInitials(role.employer_name)}</span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{role.employer_name}</span>
                      <h3 className="font-extrabold text-slate-900 text-sm">{role.job_title}</h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-[10.5px] font-extrabold shrink-0">
                    {role.vacancies - role.placed_count} Openings
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Gross Monthly Wage:</span>
                    <strong className="text-emerald-700 font-black text-sm">₹{role.monthly_gross_salary.toLocaleString('en-IN')} / mo</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Base Pay:</span>
                    <span className="font-bold text-slate-700">₹{role.base_pay.toLocaleString('en-IN')} + Incentives</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Shift Schedule:</span>
                    <span className="font-semibold text-slate-800">{role.shift_timings?.split('(')[0]}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Assigned EV Fleet:</span>
                    <span className="font-semibold text-emerald-700 truncate max-w-[150px]">{role.vehicle_model?.split('(')[0]}</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Tier: <strong className="text-slate-800 font-bold">{role.preferred_nf_tier}</strong>
                  </span>
                  <button
                    onClick={() => {
                      const parentEmp = employers.find(e => e.employer_name === role.employer_name);
                      if (parentEmp) setSelectedEmployer(parentEmp);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <span>View Role Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 5. TAB 3: Operating Hubs & Charging Infrastructure ─────────────── */}
      {activeTab === 'hubs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
            {employers.flatMap(e => (e.hubs || []).map((hub, hIdx) => (
              <div key={`${e.id}-${hIdx}`} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-emerald-300 hover:shadow-md transition">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {e.employer_name}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm mt-1.5">{hub.name}</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10.5px] font-bold shrink-0">
                    {hub.capacity} Fleet Capacity
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">{hub.address}</p>

                <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <BatteryCharging className="w-4 h-4 text-emerald-600" />
                    Fast Charging Docks:
                  </span>
                  <strong className="text-emerald-700 font-bold">{hub.charging_points} Docks Active</strong>
                </div>
              </div>
            )))}
          </div>
        </div>
      )}

      {/* ─── 6. EMPLOYER DETAILS SLIDE-OVER SIDEBAR (White Theme) ──────────── */}
      {selectedEmployer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-fadeIn"
            onClick={() => setSelectedEmployer(null)}
          />

          {/* Right Slide-over Sheet */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-slideLeft">
              
              {/* Sidebar Header */}
              <div className="p-6 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-200 shadow-sm flex items-center justify-center font-black text-slate-800 text-lg overflow-hidden shrink-0">
                    {selectedEmployer.logo_url ? (
                      <img src={selectedEmployer.logo_url} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                    ) : (
                      <span>{getCompanyInitials(selectedEmployer.employer_name)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-black text-slate-900 truncate">{selectedEmployer.employer_name}</h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                        Active MOU
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5 font-mono">
                      {selectedEmployer.company_code} • {selectedEmployer.industry}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{selectedEmployer.primary_city} (Headquarters & Central Hub)</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEmployer(null)}
                  className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition shadow-2xs shrink-0"
                  title="Close Sidebar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sidebar Content Scrollable Area */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800 flex-1">
                
                {/* 0. Quick Stats Header Strip */}
                <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">OPENINGS</span>
                    <strong className="text-sm font-black text-indigo-700">
                      {(selectedEmployer.active_roles || []).reduce((sum, r) => sum + (r.vacancies - r.placed_count), 0)} Live
                    </strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">PLACED</span>
                    <strong className="text-sm font-black text-purple-700">
                      {selectedEmployer.total_placed_candidates || 0} Pilots
                    </strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">EV FLEET</span>
                    <strong className="text-sm font-black text-emerald-700">100% EV</strong>
                  </div>
                </div>

                {/* 1. Point of Contact Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">CORPORATE HIRING LEAD</span>
                  <div className="flex justify-between items-center">
                    <div>
                      <strong className="text-slate-900 text-sm block">{selectedEmployer.contact_person}</strong>
                      <span className="text-[11px] text-slate-500">{selectedEmployer.contact_designation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${selectedEmployer.contact_email}`}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 shadow-2xs"
                      >
                        <Mail className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Email</span>
                      </a>
                      <a
                        href={`tel:${selectedEmployer.contact_phone}`}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm shadow-emerald-600/20"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call HR</span>
                      </a>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-500">
                    <span>Email: <strong className="text-slate-800">{selectedEmployer.contact_email}</strong></span>
                    <span>Phone: <strong className="text-slate-800 font-mono">{selectedEmployer.contact_phone}</strong></span>
                  </div>
                </div>

                {/* 2. EV Vehicle Allocation Policy */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-emerald-600" />
                    <strong className="text-emerald-950 font-bold">Employer-Provided EV Fleet Model</strong>
                  </div>
                  <div className="text-slate-900 font-bold text-sm">{selectedEmployer.allocated_ev_model}</div>
                  <p className="text-emerald-800 text-xs">
                    100% employer-sponsored commercial EV with zero fuel or battery swapping charges for mobilized pilots.
                  </p>
                </div>

                {/* 3. Active Job Openings Under this Employer */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-900 uppercase text-[10.5px] tracking-wider text-slate-400">
                      ACTIVE JOB ROLES & VACANCIES ({selectedEmployer.active_roles?.length || 0})
                    </h4>

                    <button
                      onClick={() => {
                        setTargetEmployerId(selectedEmployer.id);
                        setShowAddRoleModal(true);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-[11px] flex items-center gap-1"
                    >
                      <PlusCircle className="w-3 h-3" />
                      <span>Add Role</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(selectedEmployer.active_roles || []).map((role, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-slate-900 font-bold text-xs block">{role.job_title}</strong>
                            <span className="text-[10.5px] font-mono text-slate-400">{role.role_code} • {role.work_type}</span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800">
                            {role.vacancies - role.placed_count} Open / {role.vacancies} Total
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-slate-500 block">Monthly Gross Salary:</span>
                            <strong className="text-emerald-700 text-sm">₹{role.monthly_gross_salary.toLocaleString('en-IN')} / mo</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Shift Timings:</span>
                            <strong className="text-slate-800">{role.shift_timings}</strong>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1">
                          <span className="font-bold text-slate-700 block">Required Qualification:</span>
                          <p className="text-slate-600">{role.required_qualification}</p>
                        </div>

                        {role.perks && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {role.perks.map((p, pIdx) => (
                              <span key={pIdx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                                ✓ {p}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Charging & Delivery Hubs */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">OPERATING DELIVERY HUBS</span>
                  <div className="space-y-2">
                    {(selectedEmployer.hubs || []).map((hub, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                        <strong className="text-slate-900 block text-xs">{hub.name}</strong>
                        <p className="text-slate-500 text-[11px]">{hub.address}</p>
                        <div className="flex justify-between text-[10.5px] text-emerald-700 font-semibold pt-1">
                          <span>Capacity: {hub.capacity} Pilots</span>
                          <span>{hub.charging_points} Charging Docks Active</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Sidebar Footer Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setTargetEmployerId(selectedEmployer.id);
                    setShowAddRoleModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Post Another Job Role</span>
                </button>

                <button
                  onClick={() => setSelectedEmployer(null)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm shadow-emerald-600/20"
                >
                  Done
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ─── 7. MODAL: Add New Employer Partner (Comprehensive Multi-Section White Theme Form) ───────── */}
      {showAddEmployerModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative my-8 animate-scaleUp max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={() => setShowAddEmployerModal(false)}
              className="absolute right-5 top-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 border-b border-slate-100 pb-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Register New Commercial Employer Partner</h2>
                <p className="text-xs text-slate-500 font-medium">Onboard a corporate green fleet partner, define EV vehicle policies, operating hubs & initial hiring quota.</p>
              </div>
            </div>

            <form onSubmit={handleCreateEmployerSubmit} className="space-y-6 text-xs">
              
              {/* SECTION 1: Corporate & Entity Information */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold uppercase text-[11px] tracking-wider">
                  <Building className="w-4 h-4 text-emerald-600" />
                  <span>1. Corporate Identity & Legal Profile</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Company / Legal Entity Name *</label>
                    <input
                      type="text"
                      value={newEmployerName}
                      onChange={e => setNewEmployerName(e.target.value)}
                      placeholder="e.g. Zepto Electric Logistics Private Limited"
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Brand / Trade Display Name</label>
                    <input
                      type="text"
                      value={newBrandName}
                      onChange={e => setNewBrandName(e.target.value)}
                      placeholder="e.g. Zepto Green Fleet"
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Industry Sector & Domain *</label>
                    <select
                      value={newIndustry}
                      onChange={e => setNewIndustry(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold"
                    >
                      <option value="Quick Commerce EV Logistics">Quick Commerce (10-Min Delivery Logistics)</option>
                      <option value="Hyperlocal Food Delivery">Hyperlocal Food & Restaurant Delivery</option>
                      <option value="Clean Urban Ride Hailing">Clean Urban EV Ride Hailing (2W / 4W)</option>
                      <option value="E-Commerce Express Delivery">E-Commerce 3PL Express Parcel Logistics</option>
                      <option value="B2B Green Cold Chain">B2B Green Cold Chain & Bulk Fleet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Employer Partner Category</label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold"
                    >
                      <option value="QUICK_COMMERCE">Quick Commerce</option>
                      <option value="FOOD_DELIVERY">Food Delivery</option>
                      <option value="RIDE_HAILING">Ride Hailing</option>
                      <option value="ECOMMERCE">E-Commerce Logistics</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">CIN / GSTIN Registration Number</label>
                    <input
                      type="text"
                      value={newCinGstin}
                      onChange={e => setNewCinGstin(e.target.value)}
                      placeholder="e.g. U74999KA2022PTC128491 / 29AABCE1284P1Z4"
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Registered Corporate Office Address</label>
                    <input
                      type="text"
                      value={newRegisteredAddress}
                      onChange={e => setNewRegisteredAddress(e.target.value)}
                      placeholder="Street address, Tech Park, City, PIN"
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                  <input
                    type="checkbox"
                    id="newMouSigned"
                    checked={newMouSigned}
                    onChange={e => setNewMouSigned(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <label htmlFor="newMouSigned" className="font-semibold text-slate-800 text-xs cursor-pointer">
                    Commercial Hiring MOU Executed & Legally Signed with Zero Placement Surcharge to Candidates
                  </label>
                </div>
              </div>

              {/* SECTION 2: Operational Footprint & Delivery Hub */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold uppercase text-[11px] tracking-wider">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span>2. Operational Footprint & Delivery Hub Allocation</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Primary Operating City *</label>
                    <select
                      value={newPrimaryCity}
                      onChange={e => setNewPrimaryCity(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold"
                    >
                      <option value="Bengaluru">Bengaluru, Karnataka</option>
                      <option value="Delhi NCR">Delhi NCR (Gurgaon / Noida / Delhi)</option>
                      <option value="Hyderabad">Hyderabad, Telangana</option>
                      <option value="Mumbai">Mumbai / MMR, Maharashtra</option>
                      <option value="Chennai">Chennai, Tamil Nadu</option>
                      <option value="Pune">Pune, Maharashtra</option>
                      <option value="Kolkata">Kolkata, West Bengal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Initial Delivery Hub Name *</label>
                    <input
                      type="text"
                      value={newHubName}
                      onChange={e => setNewHubName(e.target.value)}
                      placeholder="e.g. Koramangala 4th Block Mega Dark Store"
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Hub Full Street Address</label>
                    <input
                      type="text"
                      value={newHubAddress}
                      onChange={e => setNewHubAddress(e.target.value)}
                      placeholder="e.g. Plot 18, 80ft Road, 4th Block Koramangala, Bengaluru"
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pilot Fleet Parking Capacity</label>
                    <input
                      type="number"
                      value={newHubCapacity}
                      onChange={e => setNewHubCapacity(e.target.value)}
                      placeholder="50"
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Dedicated EV Fast Charging Docks</label>
                    <input
                      type="number"
                      value={newHubChargingPoints}
                      onChange={e => setNewHubChargingPoints(e.target.value)}
                      placeholder="20"
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: EV Vehicle Fleet Policy */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
                <div className="flex items-center gap-2 text-emerald-950 font-bold uppercase text-[11px] tracking-wider">
                  <Car className="w-4 h-4 text-emerald-700" />
                  <span>3. Commercial EV Fleet Allocation & Battery Policy</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-emerald-950 mb-1">Allocated EV Fleet Model *</label>
                    <input
                      type="text"
                      value={newVehicleModel}
                      onChange={e => setNewVehicleModel(e.target.value)}
                      placeholder="e.g. Ather 450X Commercial / TVS iQube Cargo / Hero Nyx"
                      className="w-full p-2.5 rounded-xl bg-white border border-emerald-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-emerald-950 mb-1">Vehicle Provision & Fuel Policy</label>
                    <select
                      value={newVehiclePolicy}
                      onChange={e => setNewVehiclePolicy(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-emerald-300 text-slate-900 font-semibold"
                    >
                      <option value="100% Employer Provided EV with Zero Fuel & Swap Cost">100% Employer Provided EV (Zero Fuel & Swap Cost)</option>
                      <option value="Subsidized Fleet Lease with Free Unlimited Swaps">Subsidized Fleet Lease + Free Unlimited Swaps</option>
                      <option value="Company Sponsored Battery Swapping Pass">Company Sponsored Battery Swapping Pass</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/80 border border-emerald-200 text-[11.5px] text-emerald-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Candidates deployed under this employer are protected against vehicle security deposits and out-of-pocket petrol expenses.</span>
                </div>
              </div>

              {/* SECTION 4: HR & Operations Point of Contact */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold uppercase text-[11px] tracking-wider">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>4. HR & Operations Point of Contact</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contact Person Name *</label>
                    <input
                      type="text"
                      value={newContactPerson}
                      onChange={e => setNewContactPerson(e.target.value)}
                      placeholder="e.g. Ananya Roy"
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Designation</label>
                    <input
                      type="text"
                      value={newContactDesignation}
                      onChange={e => setNewContactDesignation(e.target.value)}
                      placeholder="e.g. Talent Acquisition & Diversity Lead"
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Official Email Address *</label>
                    <input
                      type="email"
                      value={newContactEmail}
                      onChange={e => setNewContactEmail(e.target.value)}
                      placeholder="hiring@zepto-ev.com"
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold"
                      required
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block font-bold text-slate-700 mb-1">Direct Mobile / WhatsApp Phone Number *</label>
                    <input
                      type="tel"
                      value={newContactPhone}
                      onChange={e => setNewContactPhone(e.target.value)}
                      placeholder="+91 98765 44000"
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-bold"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: Initial Commercial Job Role */}
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-4">
                <div className="flex items-center gap-2 text-indigo-950 font-bold uppercase text-[11px] tracking-wider">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <span>5. Initial Commercial Job Opening & Wage Package</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block font-bold text-indigo-950 mb-1">Job Designation Title *</label>
                    <input
                      type="text"
                      value={newInitialRole}
                      onChange={e => setNewInitialRole(e.target.value)}
                      placeholder="e.g. EV Last-Mile Delivery Pilot"
                      className="w-full p-2.5 rounded-xl bg-white border border-indigo-300 text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-indigo-950 mb-1">Open Vacancies Count *</label>
                    <input
                      type="number"
                      value={newInitialVacancies}
                      onChange={e => setNewInitialVacancies(e.target.value)}
                      placeholder="25"
                      className="w-full p-2.5 rounded-xl bg-white border border-indigo-300 text-slate-900 font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-indigo-950 mb-1">Guaranteed Gross Salary (₹/mo) *</label>
                    <input
                      type="number"
                      value={newInitialSalary}
                      onChange={e => setNewInitialSalary(e.target.value)}
                      placeholder="21500"
                      className="w-full p-2.5 rounded-xl bg-white border border-indigo-300 text-slate-900 font-bold"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-indigo-950 mb-1">Shift Schedule</label>
                    <select
                      value={newInitialShift}
                      onChange={e => setNewInitialShift(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-indigo-300 text-slate-900 font-semibold"
                    >
                      <option value="08:00 AM - 04:30 PM (Day Shift)">08:00 AM - 04:30 PM (Regular Day Shift)</option>
                      <option value="07:00 AM - 03:30 PM (Morning Express)">07:00 AM - 03:30 PM (Morning Express)</option>
                      <option value="12:00 PM - 08:30 PM (Evening Peak)">12:00 PM - 08:30 PM (Evening Peak)</option>
                      <option value="Flexible (Airport Corridor)">Flexible (Airport / Corridor Shift)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-indigo-950 mb-1">Preferred Candidate Tier</label>
                    <select
                      value={newInitialTier}
                      onChange={e => setNewInitialTier(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-indigo-300 text-slate-900 font-semibold"
                    >
                      <option value="NF1 / NF2">NF1 / NF2 (High Readiness)</option>
                      <option value="NF1">NF1 (Immediate Job Ready)</option>
                      <option value="NF1 / NF2 / NF3">All Tiers (NF1 / NF2 / NF3)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block font-bold text-indigo-950 mb-1">Minimum Qualification & Driving License Criteria</label>
                    <input
                      type="text"
                      value={newInitialQualification}
                      onChange={e => setNewInitialQualification(e.target.value)}
                      placeholder="e.g. 10th Standard Pass, Basic Android Smartphone usage, Learner or Permanent DL"
                      className="w-full p-2.5 rounded-xl bg-white border border-indigo-300 text-slate-900"
                    />
                  </div>
                </div>

                {/* Salary Breakdown Preview */}
                <div className="p-3 rounded-xl bg-white border border-indigo-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-700">Wage Structure Breakdown:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px]">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                      Base Fixed: <strong>₹{Math.round((parseInt(newInitialSalary) || 21500) * 0.75).toLocaleString('en-IN')}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold">
                      Bonus & Incentives: <strong>₹{Math.round((parseInt(newInitialSalary) || 21500) * 0.25).toLocaleString('en-IN')}</strong>
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-black">
                      Total CTC: ₹{parseInt(newInitialSalary || 21500).toLocaleString('en-IN')} / mo
                    </span>
                  </div>
                </div>

                {/* Perks Checklist */}
                <div>
                  <label className="block font-bold text-indigo-950 mb-1.5">Candidate Benefits & Safety Perks</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_PERKS_OPTIONS.map((perk, idx) => {
                      const isSelected = newInitialPerks.includes(perk);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleInitialPerk(perk)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5 text-slate-400" />}
                          <span>{perk}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddEmployerModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition text-xs flex items-center gap-2 shadow-sm shadow-emerald-600/20"
                >
                  <Check className="w-4 h-4" />
                  <span>Register & Onboard Employer</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ─── 8. MODAL: Add New Job Role / Vacancy (Comprehensive Multi-Section White Theme Form) ───────── */}
      {showAddRoleModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative my-8 animate-scaleUp max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={() => setShowAddRoleModal(false)}
              className="absolute right-5 top-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 border-b border-slate-100 pb-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Post New Commercial Job Opening & Role</h2>
                <p className="text-xs text-slate-500 font-medium">Define candidate eligibility bar, guaranteed wage structure, shift timings & hub location.</p>
              </div>
            </div>

            <form onSubmit={handleAddJobRoleSubmit} className="space-y-6 text-xs">
              
              {/* SECTION 1: Employer & Role Identity */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold uppercase text-[11px] tracking-wider">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>1. Employer Partner & Role Designation</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Hiring Employer Partner *</label>
                  <select
                    value={targetEmployerId || (employers[0]?.id || '')}
                    onChange={e => setTargetEmployerId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-xs"
                    required
                  >
                    {employers.map(e => (
                      <option key={e.id} value={e.id}>
                        {e.employer_name} ({e.company_code} • {e.primary_city})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Job Designation Title *</label>
                    <input
                      type="text"
                      value={newRoleTitle}
                      onChange={e => setNewRoleTitle(e.target.value)}
                      placeholder="e.g. Dark Store Express Dispatcher & EV Pilot"
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Employment Work Type</label>
                    <select
                      value={newRoleWorkType}
                      onChange={e => setNewRoleWorkType(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold"
                    >
                      <option value="Full-Time">Full-Time (8.5 Hours Regular)</option>
                      <option value="Part-Time Morning">Part-Time Morning (4 Hours)</option>
                      <option value="Part-Time Evening">Part-Time Evening Peak (4 Hours)</option>
                      <option value="Weekend Express">Weekend Express Pilot</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Total Open Vacancies *</label>
                    <input
                      type="number"
                      value={newRoleVacancies}
                      onChange={e => setNewRoleVacancies(e.target.value)}
                      placeholder="15"
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Max Delivery Radius (km)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newRoleDeliveryRadius}
                      onChange={e => setNewRoleDeliveryRadius(e.target.value)}
                      placeholder="4.5"
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Assigned Delivery / Charging Hub</label>
                    <input
                      type="text"
                      value={newRoleHub}
                      onChange={e => setNewRoleHub(e.target.value)}
                      placeholder="e.g. Indiranagar 100ft Hub / Koramangala 4th Block Hub"
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Guaranteed Compensation & Wage Breakdown */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
                <div className="flex items-center gap-2 text-emerald-950 font-bold uppercase text-[11px] tracking-wider">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>2. Guaranteed Compensation & Wage Breakdown</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-emerald-950 mb-1">Monthly Gross Wage (₹) *</label>
                    <input
                      type="number"
                      value={newRoleSalary}
                      onChange={e => setNewRoleSalary(e.target.value)}
                      placeholder="21000"
                      className="w-full p-2.5 rounded-xl bg-white border border-emerald-300 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-emerald-950 mb-1">Payout Frequency Cycle</label>
                    <select
                      value={newRolePayoutCycle}
                      onChange={e => setNewRolePayoutCycle(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-emerald-300 text-slate-900 font-semibold"
                    >
                      <option value="Weekly Direct Bank Transfer">Weekly Direct Bank Transfer (Every Friday)</option>
                      <option value="Bi-Weekly Payout">Bi-Weekly Payout (1st & 16th)</option>
                      <option value="Monthly Direct Bank Payout">Monthly Direct Bank Payout (1st of Month)</option>
                    </select>
                  </div>
                </div>

                {/* Real-time Salary Breakdown Card */}
                <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 space-y-2">
                  <span className="font-bold text-emerald-950 text-xs block">Guaranteed Monthly Pilot Compensation Preview</span>
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Fixed Base Pay</span>
                      <strong className="text-slate-900 text-xs">₹{Math.round((parseInt(newRoleSalary) || 21000) * 0.75).toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-emerald-700 block text-[10px]">Punctuality & Trip Bonus</span>
                      <strong className="text-emerald-800 text-xs">₹{Math.round((parseInt(newRoleSalary) || 21000) * 0.25).toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-indigo-600 text-white">
                      <span className="text-indigo-200 block text-[10px]">Total Gross / mo</span>
                      <strong className="text-white text-xs">₹{parseInt(newRoleSalary || 21000).toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Shift Timing & Schedule */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold uppercase text-[11px] tracking-wider">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>3. Shift Timing & Work Schedule</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Shift Slot *</label>
                    <select
                      value={newRoleShift}
                      onChange={e => setNewRoleShift(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold"
                    >
                      <option value="08:00 AM - 04:30 PM (Day Shift)">08:00 AM - 04:30 PM (Day Shift)</option>
                      <option value="07:00 AM - 03:30 PM (Morning Express)">07:00 AM - 03:30 PM (Morning Express)</option>
                      <option value="12:00 PM - 08:30 PM (Evening Peak)">12:00 PM - 08:30 PM (Evening Peak)</option>
                      <option value="10:00 PM - 06:00 AM (Night Logistics)">10:00 PM - 06:00 AM (Night Logistics)</option>
                      <option value="Flexible (Airport Corridor)">Flexible (Airport Corridor)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Working Days per Week</label>
                    <select
                      value={newRoleWorkingDays}
                      onChange={e => setNewRoleWorkingDays(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold"
                    >
                      <option value="6 Days / Week (1 Rostered Off)">6 Days / Week (1 Rostered Off)</option>
                      <option value="5 Days / Week (2 Rostered Off)">5 Days / Week (2 Rostered Off)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Candidate Eligibility & Readiness */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold uppercase text-[11px] tracking-wider">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>4. Candidate Eligibility & Assessment Criteria</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Minimum Education</label>
                    <select
                      value={newRoleEduLevel}
                      onChange={e => setNewRoleEduLevel(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold"
                    >
                      <option value="10th Standard Pass">10th Standard Pass (SSLC)</option>
                      <option value="8th Standard Pass">8th Standard Pass</option>
                      <option value="12th / ITI Pass">12th / ITI Pass</option>
                      <option value="No Minimum Bar">No Minimum Bar (Literate)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Driving License Requirement</label>
                    <select
                      value={newRoleDLReq}
                      onChange={e => setNewRoleDLReq(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold"
                    >
                      <option value="Learner or Permanent 2W DL">Learner or Permanent 2W DL</option>
                      <option value="Permanent 2W License Mandatory">Permanent 2W License Mandatory</option>
                      <option value="Commercial 4W / LMV License">Commercial 4W / LMV License</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Target Mobilizer Tier</label>
                    <select
                      value={newRolePreferredTier}
                      onChange={e => setNewRolePreferredTier(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold"
                    >
                      <option value="NF1 / NF2">NF1 / NF2 Preferred</option>
                      <option value="NF1">NF1 High Readiness Only</option>
                      <option value="NF1 / NF2 / NF3">Any Assessed Candidate (NF1/NF2/NF3)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block font-bold text-slate-700 mb-1">Detailed Eligibility Notes & Skills</label>
                    <textarea
                      rows={2}
                      value={newRoleQualification}
                      onChange={e => setNewRoleQualification(e.target.value)}
                      placeholder="e.g. Basic Android Smartphone literacy, Google Maps navigation, customer politeness"
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: Benefits & Perks */}
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
                <div className="flex items-center gap-2 text-indigo-950 font-bold uppercase text-[11px] tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>5. Commercial EV Perks & Safety Shield Checklist</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {ALL_PERKS_OPTIONS.map((perk, idx) => {
                    const isSelected = newRolePerks.includes(perk);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleRolePerk(perk)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5 text-slate-400" />}
                        <span>{perk}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition text-xs flex items-center gap-2 shadow-sm shadow-indigo-600/20"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Publish Job Role & Openings</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
