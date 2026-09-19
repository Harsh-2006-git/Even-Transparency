import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

// In-memory fallback dataset for employers and their active job opportunities/roles
let localEmployers = [
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
    mou_date: '2025-08-10',
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
    allocated_ev_model: 'Ather 450X Commercial Spec (Smart 2W EV)',
    active_roles: [
      {
        id: 'role-zom-01',
        job_title: 'EV Last-Mile Delivery Pilot',
        role_code: 'ZOM-PILOT-01',
        vacancies: 35,
        placed_count: 24,
        monthly_gross_salary: 21500,
        base_pay: 16000,
        performance_bonus: 5500,
        shift_timings: '08:00 AM - 04:30 PM (Day Shift)',
        work_type: 'Full-Time',
        delivery_radius_km: 5.5,
        required_qualification: '10th Standard Pass, Basic Android Smartphone usage, Learner or Permanent DL',
        preferred_nf_tier: 'NF1 / NF2',
        perks: ['Accidental Insurance ₹5 Lakhs', 'Unlimited Battery Swaps', 'Safety Gear & Raincoat Kit', 'Weekly Payout Cycle'],
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
    total_placed_candidates: 30,
    created_at: '2025-08-10T00:00:00.000Z'
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
    mou_date: '2025-09-01',
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
    allocated_ev_model: 'Hero Electric Nyx Heavy Cargo (Dual Battery)',
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
    total_placed_candidates: 28,
    created_at: '2025-09-01T00:00:00.000Z'
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
    mou_date: '2025-10-15',
    status: 'ACTIVE',
    contact_person: 'Sneha Roy',
    contact_designation: 'Operations Regional Manager',
    contact_email: 'sneha.roy@blinkit.com',
    contact_phone: '+91 98765 44003',
    hubs: [
      { name: 'HSR Layout Sector 1 Hub', address: '27th Main Rd, Sector 1, HSR Layout, Bengaluru', capacity: 35, charging_points: 12 }
    ],
    vehicle_policy: 'EMPLOYER_PROVIDED_EV',
    allocated_ev_model: 'TVS iQube Commercial Smart Cargo',
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
        perks: ['Health Insurance Coverage', 'Free Uniform & Rain Kit', 'On-time Salary Direct Bank Credit'],
        status: 'OPEN'
      }
    ],
    total_placed_candidates: 15,
    created_at: '2025-10-15T00:00:00.000Z'
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
    mou_date: '2025-11-20',
    status: 'ACTIVE',
    contact_person: 'Rohan Deshmukh',
    contact_designation: 'EV Fleet Partnership Director',
    contact_email: 'rohan.d@uber-green.org',
    contact_phone: '+91 98765 44004',
    hubs: [
      { name: 'KIAL Clean Airport Hub', address: 'Terminal 1 Dedicated EV Bay, Kempegowda Intl Airport, Bengaluru', capacity: 50, charging_points: 30 }
    ],
    vehicle_policy: 'EMPLOYER_PROVIDED_EV',
    allocated_ev_model: 'BluSmart / Tata Tigor Commercial EV 4W & 2W Fleet',
    active_roles: [
      {
        id: 'role-ubr-01',
        job_title: 'Women EV Ride Fleet Captain',
        role_code: 'UBR-CAPT-01',
        vacancies: 20,
        placed_count: 6,
        monthly_gross_salary: 24000,
        base_pay: 18000,
        performance_bonus: 6000,
        shift_timings: 'Flexible (Dedicated Airport & Tech Park Corridors)',
        work_type: 'Full-Time / Flexible',
        delivery_radius_km: 15.0,
        required_qualification: 'Permanent Driving License, Clean driving record, Customer politeness etiquette',
        preferred_nf_tier: 'NF1',
        perks: ['Dedicated Women SOS Helpline', 'Airport Lounge Access', 'Monthly Fuel/Charging Credit Pass', 'Guaranteed Daily Trips'],
        status: 'OPEN'
      }
    ],
    total_placed_candidates: 6,
    created_at: '2025-11-20T00:00:00.000Z'
  }
];

// 1. GET /api/employers - List all employers with active roles & metrics
export const getEmployers = async (req, res) => {
  try {
    const { search, category, city, status } = req.query;

    let list = [...localEmployers];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        e.employer_name.toLowerCase().includes(q) ||
        e.company_code.toLowerCase().includes(q) ||
        e.industry.toLowerCase().includes(q) ||
        e.primary_city.toLowerCase().includes(q) ||
        e.active_roles?.some(r => r.job_title.toLowerCase().includes(q))
      );
    }

    if (category && category !== 'ALL') {
      list = list.filter(e => e.category === category);
    }

    if (city && city !== 'ALL') {
      list = list.filter(e => e.primary_city.toLowerCase() === city.toLowerCase() || e.operating_cities.includes(city));
    }

    if (status && status !== 'ALL') {
      list = list.filter(e => e.status === status);
    }

    // Calculate aggregated stats
    const totalEmployers = list.length;
    const totalLiveOpenings = list.reduce((sum, e) => sum + (e.active_roles?.reduce((rSum, r) => rSum + (r.vacancies - r.placed_count), 0) || 0), 0);
    const totalPlaced = list.reduce((sum, e) => sum + (e.total_placed_candidates || 0), 0);
    const allRoles = list.flatMap(e => e.active_roles || []);
    const avgSalary = allRoles.length > 0 ? Math.round(allRoles.reduce((sum, r) => sum + r.monthly_gross_salary, 0) / allRoles.length) : 21000;

    return res.json({
      success: true,
      total: totalEmployers,
      stats: {
        total_employers: totalEmployers,
        total_live_openings: totalLiveOpenings,
        total_placed: totalPlaced,
        average_salary: avgSalary,
        green_employers_count: list.filter(e => e.is_green_employer).length
      },
      data: list
    });
  } catch (error) {
    console.error('Error fetching employers:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. POST /api/employers - Add a new employer partner
export const createEmployer = async (req, res) => {
  try {
    const {
      employer_name,
      industry,
      category = 'QUICK_COMMERCE',
      primary_city = 'Bengaluru',
      operating_cities = ['Bengaluru'],
      contact_person,
      contact_designation,
      contact_email,
      contact_phone,
      vehicle_policy = 'EMPLOYER_PROVIDED_EV',
      allocated_ev_model = 'Ather / Hero Commercial EV',
      initial_role_title,
      initial_vacancies = 10,
      initial_monthly_salary = 20000
    } = req.body;

    if (!employer_name) {
      return res.status(400).json({ success: false, message: 'Employer name is required' });
    }

    const newId = `emp-${Date.now()}`;
    const newCode = `EMP-${employer_name.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;

    const initialRoles = initial_role_title ? [
      {
        id: `role-${Date.now()}`,
        job_title: initial_role_title,
        role_code: `${newCode}-R1`,
        vacancies: parseInt(initial_vacancies) || 10,
        placed_count: 0,
        monthly_gross_salary: parseInt(initial_monthly_salary) || 20000,
        base_pay: Math.round((parseInt(initial_monthly_salary) || 20000) * 0.75),
        performance_bonus: Math.round((parseInt(initial_monthly_salary) || 20000) * 0.25),
        shift_timings: '08:00 AM - 04:30 PM (Day Shift)',
        work_type: 'Full-Time',
        delivery_radius_km: 5.0,
        required_qualification: '10th Standard Pass, Valid DL / Learner DL',
        preferred_nf_tier: 'NF1 / NF2',
        perks: ['Accidental Insurance', 'Employer Provided EV', 'Battery Swap Access'],
        status: 'OPEN'
      }
    ] : [];

    const newEmployer = {
      id: newId,
      employer_name,
      company_code: newCode,
      industry: industry || 'EV Logistics & Delivery',
      category,
      is_green_employer: true,
      logo_url: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
      primary_city,
      operating_cities: Array.isArray(operating_cities) ? operating_cities : [primary_city],
      mou_signed: true,
      mou_date: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      contact_person: contact_person || 'HR Hiring Lead',
      contact_designation: contact_designation || 'Operations Head',
      contact_email: contact_email || `hiring@${employer_name.toLowerCase().replace(/\s+/g, '')}.com`,
      contact_phone: contact_phone || '+91 98765 00000',
      hubs: [
        { name: `${primary_city} Central Green Hub`, address: `Main Operations Hub, ${primary_city}`, capacity: 50, charging_points: 20 }
      ],
      vehicle_policy,
      allocated_ev_model,
      active_roles: initialRoles,
      total_placed_candidates: 0,
      created_at: new Date().toISOString()
    };

    localEmployers.unshift(newEmployer);

    return res.status(201).json({
      success: true,
      message: 'Employer partner registered successfully',
      data: newEmployer
    });
  } catch (error) {
    console.error('Error creating employer:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. POST /api/employers/:id/roles - Add a new Job Role / Opening under an Employer
export const addJobRoleToEmployer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      job_title,
      vacancies = 10,
      monthly_gross_salary = 20000,
      base_pay,
      performance_bonus,
      shift_timings = '08:00 AM - 04:30 PM (Day Shift)',
      work_type = 'Full-Time',
      delivery_radius_km = 5.0,
      required_qualification,
      preferred_nf_tier = 'NF1 / NF2',
      perks = ['Accidental Insurance', 'Battery Swap Access']
    } = req.body;

    const employer = localEmployers.find(e => e.id === id);
    if (!employer) {
      return res.status(404).json({ success: false, message: 'Employer not found' });
    }

    const roleGross = parseInt(monthly_gross_salary) || 20000;
    const newRole = {
      id: `role-${Date.now()}`,
      job_title: job_title || 'EV Commercial Fleet Pilot',
      role_code: `${employer.company_code}-R${(employer.active_roles?.length || 0) + 1}`,
      vacancies: parseInt(vacancies) || 10,
      placed_count: 0,
      monthly_gross_salary: roleGross,
      base_pay: base_pay ? parseInt(base_pay) : Math.round(roleGross * 0.75),
      performance_bonus: performance_bonus ? parseInt(performance_bonus) : Math.round(roleGross * 0.25),
      shift_timings,
      work_type,
      delivery_radius_km: parseFloat(delivery_radius_km) || 5.0,
      required_qualification: required_qualification || '10th Standard Pass, Basic GPS App Literacy',
      preferred_nf_tier,
      perks: Array.isArray(perks) ? perks : ['Accidental Insurance', 'Employer Provided EV'],
      status: 'OPEN'
    };

    if (!employer.active_roles) {
      employer.active_roles = [];
    }
    employer.active_roles.unshift(newRole);

    return res.status(201).json({
      success: true,
      message: 'New job role and vacancies posted successfully',
      data: newRole,
      employer
    });
  } catch (error) {
    console.error('Error adding job role:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. PUT /api/employers/:id - Update employer details
export const updateEmployer = async (req, res) => {
  try {
    const { id } = req.params;
    const index = localEmployers.findIndex(e => e.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Employer not found' });
    }

    localEmployers[index] = {
      ...localEmployers[index],
      ...req.body,
      updated_at: new Date().toISOString()
    };

    return res.json({
      success: true,
      message: 'Employer updated successfully',
      data: localEmployers[index]
    });
  } catch (error) {
    console.error('Error updating employer:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
