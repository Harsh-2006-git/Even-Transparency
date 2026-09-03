import React from 'react';
import {
  Users,
  Building2,
  GraduationCap,
  Award,
  Briefcase,
  ShieldCheck,
  Handshake,
  UserCog,
  BookOpen, MapPin, FolderSync, HeartHandshake, MessageSquare, Radio,
  ScrollText,
  Settings,
  Sparkles,
  Search,
  Download,
  Plus
} from 'lucide-react';

const SECTION_CONFIGS = {
  candidates: {
    title: 'Candidate Master Directory',
    subtitle: 'Track end-to-end candidate lifecycle from mobilization to retention across all 12 stages.',
    icon: Users,
    kpis: [
      { label: 'Total Candidates', value: '12,548' },
      { label: 'NF1 Classified', value: '3,842' },
      { label: 'NF2 Classified', value: '5,778' },
      { label: 'NF3 Classified', value: '2,928' },
    ],
    columns: ['Candidate Code', 'Name', 'Phone', 'City', 'Current Stage', 'NF Category', 'Readiness Score', 'Risk Level'],
    mockData: [
      { code: 'ET-2026-001', name: 'Priya Sharma', phone: '+91 98765 11111', city: 'Lucknow', stage: 'REGISTERED', nf: 'NF1', score: '84%', risk: 'Low' },
      { code: 'ET-2026-002', name: 'Neha Kumari', phone: '+91 98765 22222', city: 'Kanpur', stage: 'IN_TRAINING', nf: 'NF2', score: '92%', risk: 'Low' },
      { code: 'ET-2026-003', name: 'Sunita Verma', phone: '+91 98765 33333', city: 'Varanasi', stage: 'ASSESSED', nf: 'NF1', score: '88%', risk: 'Normal' },
      { code: 'ET-2026-004', name: 'Riya Patel', phone: '+91 98765 44444', city: 'Agra', stage: 'IN_TRAINING', nf: 'NF3', score: '71%', risk: 'Medium' },
    ]
  },
  trainers: {
    title: 'Trainer & Assessor Directory',
    subtitle: 'Manage certified technical trainers, soft skills instructors, and assessment evaluators.',
    icon: GraduationCap,
    kpis: [
      { label: 'Active Trainers', value: '124' },
      { label: 'Training Batches', value: '84' },
      { label: 'Avg Rating', value: '4.8 / 5.0' },
      { label: 'Certifications Issued', value: '4,420' },
    ],
    columns: ['Trainer ID', 'Full Name', 'Location', 'Specialization', 'Assigned Batches', 'Active Trainees', 'Status'],
    mockData: [
      { id: 'TR-101', name: 'Rahul Sharma', loc: 'Lucknow Hub', spec: '2W EV Riding & Safety', batches: '3 Batches', trainees: '72', status: 'Active' },
      { id: 'TR-102', name: 'Meena Yadav', loc: 'Kanpur Skill Centre', spec: 'Customer Interaction & Navigation', batches: '2 Batches', trainees: '48', status: 'Active' },
      { id: 'TR-103', name: 'Kiran Dave', loc: 'Varanasi Centre', spec: 'EV Fleet Maintenance', batches: '2 Batches', trainees: '50', status: 'Active' },
    ]
  },
  'placement-coordinators': {
    title: 'Placement Coordinators Hub',
    subtitle: 'Track field placement officers, corporate recruiter liaisons, and joining fulfillment.',
    icon: Briefcase,
    kpis: [
      { label: 'Placement Officers', value: '42' },
      { label: 'Corporate Employers', value: '169' },
      { label: 'Active Openings', value: '1,420' },
      { label: 'Joining Fulfillment', value: '92.4%' },
    ],
    columns: ['Officer Code', 'Name', 'Region', 'Hiring Partners', 'Placements (MTD)', 'Offer Acceptance', 'Status'],
    mockData: [
      { code: 'PC-881', name: 'Sanjay Deshmukh', reg: 'Maharashtra & Pune', partners: '14 Employers', placed: '142', accept: '94%', status: 'Active' },
      { code: 'PC-882', name: 'Pooja Hegde', reg: 'Bengaluru & Karnataka', partners: '22 Employers', placed: '188', accept: '91%', status: 'Active' },
      { code: 'PC-883', name: 'Amit Tiwari', reg: 'Uttar Pradesh & NCR', partners: '18 Employers', placed: '165', accept: '89%', status: 'Active' },
    ]
  },
  'training-modules': {
    title: 'Curriculum & Training Modules',
    subtitle: 'Standardized skilling modules, digital literacy courses, and EV pilot driving curriculum.',
    icon: BookOpen,
    kpis: [
      { label: 'Total Modules', value: '18' },
      { label: 'Core Driving', value: '6 Modules' },
      { label: 'Safety & Defense', value: '4 Modules' },
      { label: 'Customer & Tech', value: '8 Modules' },
    ],
    columns: ['Module Code', 'Module Title', 'Category', 'Duration (Hours)', 'Mandatory For', 'Passing Score', 'Status'],
    mockData: [
      { code: 'MOD-EV-01', title: 'Two-Wheeler EV Dynamics & Battery Care', cat: 'Technical Driving', dur: '24 Hours', man: 'NF1, NF2', pass: '80%', status: 'Published' },
      { code: 'MOD-SAF-02', title: 'Defensive City Riding & Night Navigation', cat: 'Safety Protocol', dur: '16 Hours', man: 'All Candidates', pass: '85%', status: 'Published' },
      { code: 'MOD-APP-03', title: 'Smartphone GPS Navigation & Delivery Apps', cat: 'Digital Literacy', dur: '12 Hours', man: 'All Candidates', pass: '75%', status: 'Published' },
    ]
  },
  'training-centres': {
    title: 'Authorized Training Centres',
    subtitle: 'Physical driving tracks, simulation labs, classroom infrastructure, and EV charging facilities.',
    icon: MapPin,
    kpis: [
      { label: 'Training Centres', value: '36' },
      { label: 'Current Capacity', value: '3,200 seats' },
      { label: 'Avg Utilization', value: '88.5%' },
      { label: 'EV Simulators', value: '72 units' },
    ],
    columns: ['Centre Code', 'Centre Name', 'City / State', 'Facility Head', 'Batch Capacity', 'Active Trainees', 'Status'],
    mockData: [
      { code: 'TC-UP-01', name: 'Lucknow Prime Skill Hub', loc: 'Lucknow, UP', head: 'Vikram Chandel', cap: '250 seats', trainees: '210', status: 'Operational' },
      { code: 'TC-MH-02', name: 'Pune Livelihood Driving Campus', loc: 'Pune, MH', head: 'Deepak Joshi', cap: '300 seats', trainees: '280', status: 'Operational' },
      { code: 'TC-KA-01', name: 'Bengaluru EV Excellence Centre', loc: 'Bengaluru, KA', head: 'Radhika Swamy', cap: '400 seats', trainees: '360', status: 'Operational' },
    ]
  },
  'bulk-operations': {
    title: 'Bulk Candidate Operations & Data Ingestion',
    subtitle: 'CSV/Excel batch imports, automated document OCR pipelines, and multi-candidate stage transitions.',
    icon: FolderSync,
    kpis: [
      { label: 'Batch Jobs (30D)', value: '148' },
      { label: 'Records Ingested', value: '4,280' },
      { label: 'OCR Success Rate', value: '98.4%' },
      { label: 'Pending Processing', value: '0' },
    ],
    columns: ['Batch Job ID', 'Uploaded By', 'File Name', 'Total Records', 'Valid / Ingested', 'Errors', 'Timestamp', 'Status'],
    mockData: [
      { id: 'JOB-9941', user: 'Admin User', file: 'UP_Lucknow_Mobilization_Nov.csv', total: '450', valid: '448', err: '2', time: 'Today 08:30', status: 'Completed' },
      { id: 'JOB-9940', user: 'Sunita Verma', file: 'Sakhi_SHG_Intake_Batch4.xlsx', total: '210', valid: '210', err: '0', time: 'Yesterday', status: 'Completed' },
    ]
  },
  'job-opportunities': {
    title: 'Enterprise Job Opportunities',
    subtitle: 'Verified hiring mandates with fixed minimum wage guarantees, insurance, and EV incentives.',
    icon: Award,
    kpis: [
      { label: 'Open Positions', value: '1,742' },
      { label: 'Active Employers', value: '169' },
      { label: 'Avg Monthly Pay', value: '₹18,200' },
      { label: 'Joining Bonus Offered', value: '64% Roles' },
    ],
    columns: ['Job Code', 'Employer', 'Job Role', 'Hub City', 'Open Positions', 'Min Salary', 'Status'],
    mockData: [
      { code: 'JOB-EC-101', emp: 'Even Cargo Logistics', role: 'EV Express Delivery Pilot', loc: 'Lucknow, Kanpur', open: '120 Openings', salary: '₹18,500/mo', status: 'Actively Hiring' },
      { code: 'JOB-EV-202', emp: 'EV Mobility Solutions', role: 'Urban Fleet Rider', loc: 'Bengaluru, Pune', open: '95 Openings', salary: '₹19,000/mo', status: 'Actively Hiring' },
      { code: 'JOB-SP-303', emp: 'SpeedX Delivery', role: 'Last-Mile Courier Partner', loc: 'Delhi NCR, Agra', open: '80 Openings', salary: '₹17,800/mo', status: 'Actively Hiring' },
    ]
  },
  'employment-tracking': {
    title: 'Employment Tracking & Career Progression',
    subtitle: 'Longitudinal wage audits, biometric work attendance, shift stability, and safety support.',
    icon: HeartHandshake,
    kpis: [
      { label: 'Active Employed', value: '2,918' },
      { label: 'Retention Rate (6M)', value: '84.2%' },
      { label: 'Avg Take-Home Pay', value: '₹18,450' },
      { label: 'Safety Support Cases', value: '0 Open' },
    ],
    columns: ['Candidate', 'Employer', 'Job Title', 'Deployment Date', 'Months Retained', 'Monthly Wage', 'Status'],
    mockData: [
      { candidate: 'Priya Sharma', emp: 'Even Cargo Logistics', role: 'Delivery Pilot', date: '15 Jan 2025', ret: '14 Months', wage: '₹19,200', status: 'Retained & Active' },
      { candidate: 'Neha Singh', emp: 'EV Mobility Solutions', role: 'Fleet Specialist', date: '02 Feb 2025', ret: '13 Months', wage: '₹20,500', status: 'Promoted' },
    ]
  },
  messages: {
    title: 'Internal Stakeholder Communications',
    subtitle: 'Unified operational chat between Mobilisers, Trainers, Placement Coordinators, and Admins.',
    icon: MessageSquare,
    kpis: [
      { label: 'Active Threads', value: '48' },
      { label: 'Unread Messages', value: '12' },
      { label: 'Avg Response Time', value: '14 Mins' },
      { label: 'Broadcast Channels', value: '6' },
    ],
    columns: ['Sender', 'Role', 'Subject / Message Preview', 'Channel', 'Timestamp', 'Priority', 'Status'],
    mockData: [
      { sender: 'Anil Mishra', role: 'Mobiliser', msg: 'Please verify documents for 5 candidates in Lucknow batch.', chan: 'Document Verification', time: '10:10 AM', pri: 'High', status: 'Unread' },
      { sender: 'Ravi Singh', role: 'Mobiliser', msg: 'Assessment scheduling issue for Kanpur cohort.', chan: 'Training Support', time: '09:45 AM', pri: 'Medium', status: 'Unread' },
      { sender: 'Meena Yadav', role: 'Trainer', msg: 'Need access to new training batch syllabus for EV piloting.', chan: 'Trainer Hub', time: '09:30 AM', pri: 'Normal', status: 'Unread' },
      { sender: 'Rahul Sharma', role: 'Trainer', msg: 'Training materials updated and attendance logged.', chan: 'Batch Operations', time: '09:00 AM', pri: 'Normal', status: 'Read' },
    ]
  },
  announcements: {
    title: 'Platform Announcements & Broadcasts',
    subtitle: 'System-wide push notifications and SMS broadcasts to field teams, employers, and candidates.',
    icon: Radio,
    kpis: [
      { label: 'Active Broadcasts', value: '4' },
      { label: 'Total Reach', value: '14,200 users' },
      { label: 'Delivery Rate', value: '99.2%' },
      { label: 'Click Through', value: '68.4%' },
    ],
    columns: ['Announcement Title', 'Target Audience', 'Channels', 'Scheduled Date', 'Sent Count', 'Author', 'Status'],
    mockData: [
      { title: 'New 2026 NF Scoring & Readiness Guidelines Live', aud: 'All Mobilizers & Trainers', chan: 'In-App + Email', date: 'Today 08:00', sent: '410 users', author: 'Super Admin', status: 'Active' },
      { title: 'Scheduled Platform Maintenance on 20 May (02:00 - 04:00 AM)', aud: 'All Platform Users', chan: 'In-App Banner', date: '18 May 2025', sent: '12,548 users', author: 'DevOps Lead', status: 'Scheduled' },
    ]
  },
  'activity-logs': {
    title: 'Live Platform Activity Log',
    subtitle: 'Real-time telemetry of user logins, candidate submissions, approvals, and system state transitions.',
    icon: History,
    kpis: [
      { label: 'Events Today', value: '2,840' },
      { label: 'Active Sessions', value: '684' },
      { label: 'Automated Triggers', value: '1,120' },
      { label: 'API Uptime', value: '99.98%' },
    ],
    columns: ['Time', 'Actor', 'Role', 'Action', 'Target Entity', 'IP Address', 'Result'],
    mockData: [
      { time: '10:15 AM', actor: 'Admin User', role: 'Super Admin', act: 'CREATE_TRAINER', ent: 'Trainer: Rahul Sharma', ip: '127.0.0.1', res: 'Success' },
      { time: '09:45 AM', actor: 'Admin User', role: 'Super Admin', act: 'CREATE_BATCH', ent: 'Batch: MOB-2026-018', ip: '127.0.0.1', res: 'Success' },
      { time: '09:20 AM', actor: 'Meena Yadav', role: 'Trainer', act: 'STAGE_UPDATE', ent: 'Candidate: Priya Sharma', ip: '10.0.2.14', res: 'Success' },
      { time: '08:55 AM', actor: 'Admin User', role: 'Super Admin', act: 'ONBOARD_EMPLOYER', ent: 'Employer: Even Cargo Logistics', ip: '127.0.0.1', res: 'Success' },
    ]
  },
  training: {
    title: 'Training Batches & Cohorts',
    subtitle: 'Manage training center batches, daily biometric attendance, trainer feedback, and certifications.',
    icon: GraduationCap,
    kpis: [
      { label: 'Active Batches', value: '84' },
      { label: 'In Training', value: '2,840' },
      { label: 'Avg Attendance', value: '92.4%' },
      { label: 'Completion Rate', value: '68%' },
    ],
    columns: ['Batch Code', 'Training Center', 'Trainer', 'Start Date', 'Capacity', 'Attendance %', 'Status'],
    mockData: [
      { code: 'MOB-2026-018', center: 'Lucknow Prime Skill Hub', trainer: 'Rahul Sharma', start: '2026-02-01', cap: '25 / 25', att: '94%', status: 'Ongoing' },
      { code: 'MOB-2026-019', center: 'Kanpur Skill Centre', trainer: 'Meena Yadav', start: '2026-02-10', cap: '24 / 25', att: '89%', status: 'Ongoing' },
      { code: 'MOB-2026-020', center: 'Varanasi Centre', trainer: 'Kiran Dave', start: '2026-01-15', cap: '24 / 24', att: '96%', status: 'Ongoing' },
    ]
  },
  readiness: {
    title: 'Candidate Readiness & NF Classification',
    subtitle: 'System readiness engine, digital literacy scores, driving license verification, and pathway recommendations.',
    icon: Award,
    kpis: [
      { label: 'Evaluated Candidates', value: '9,620' },
      { label: 'Deployment Ready', value: '1,742' },
      { label: 'Additional Training Req.', value: '840' },
      { label: 'Pending Documents', value: '932' },
    ],
    columns: ['Candidate', 'Digital Literacy', 'Mobility Level', 'License Status', 'NF Category', 'Readiness Score', 'Outcome'],
    mockData: [
      { candidate: 'Priya Sharma', digital: 'Advanced', mobility: 'High', license: 'Valid 2W', nf: 'NF1', score: '88/100', outcome: 'Deployment Ready' },
      { candidate: 'Neha Kumari', digital: 'Intermediate', mobility: 'High', license: 'Valid 2W', nf: 'NF2', score: '84/100', outcome: 'In Training' },
      { candidate: 'Sunita Verma', digital: 'Basic', mobility: 'Local Only', license: 'Learner', nf: 'NF1', score: '91/100', outcome: 'Assessed' },
    ]
  },
  employers: {
    title: 'Employer Partners & Hiring Accounts',
    subtitle: 'Manage hiring partners, EV fleet operators, quick commerce hubs, and green job opportunities.',
    icon: Building2,
    kpis: [
      { label: 'Employer Partners', value: '169' },
      { label: 'Open Positions', value: '1,742' },
      { label: 'Placed Candidates', value: '3,842' },
      { label: 'Retention Rate', value: '76%' },
    ],
    columns: ['Company Name', 'Industry', 'Contact Person', 'Operating Cities', 'Open Roles', 'Placed Count', 'Status'],
    mockData: [
      { name: 'Even Cargo Logistics', ind: 'All-Women EV Logistics', contact: 'Kavita Roy', cities: 'Lucknow, Kanpur, Delhi', open: '12', placed: '523', status: 'Active' },
      { name: 'EV Mobility Solutions', ind: 'Electric 2W Fleets', contact: 'Meera Kapoor', cities: 'Bengaluru, Pune', open: '8', placed: '418', status: 'Active' },
      { name: 'SpeedX Delivery', ind: 'Quick Commerce Courier', contact: 'Deepak Nair', cities: 'Delhi NCR, Agra', open: '15', placed: '312', status: 'Active' },
      { name: 'Urban Fleet Services', ind: 'Commercial Delivery', contact: 'Arun Varma', cities: 'Mumbai, Pune', open: '6', placed: '298', status: 'Active' },
      { name: 'GreenDrive Logistics', ind: 'Green Logistics Partner', contact: 'Ramesh Sen', cities: 'Ahmedabad, Surat', open: '9', placed: '276', status: 'Active' },
    ]
  },
  deployments: {
    title: 'Candidate Deployments & Job Offers',
    subtitle: 'Offer letters, work locations, shift assignments, and joining verification.',
    icon: Briefcase,
    kpis: [
      { label: 'Total Deployments', value: '3,842' },
      { label: 'Active Employed', value: '2,918' },
      { label: 'Avg Monthly Salary', value: '₹18,450' },
      { label: 'Joining Rate', value: '92.4%' },
    ],
    columns: ['Candidate', 'Employer', 'Job Role', 'Hub City', 'Joining Date', 'Monthly Earnings', 'Deployment Status'],
    mockData: [
      { candidate: 'Priya Sharma', employer: 'Even Cargo Logistics', role: 'EV Delivery Pilot', city: 'Lucknow', date: '2026-02-15', salary: '₹18,500', status: 'Active Employed' },
      { candidate: 'Neha Singh', employer: 'EV Mobility Solutions', role: 'Fleet Specialist', city: 'Kanpur', date: '2026-01-20', salary: '₹19,000', status: 'Active Employed' },
    ]
  },
  retention: {
    title: 'Retention Milestones & Impact Monitoring',
    subtitle: 'Track 1M, 3M, 6M, 12M, 18M, 24M retention milestones, income escalation, and safety incident logs.',
    icon: ShieldCheck,
    kpis: [
      { label: 'Overall Retention', value: '76%' },
      { label: '90-Day Retention', value: '91.2%' },
      { label: '180-Day Retention', value: '84.5%' },
      { label: 'Avg Income Growth', value: '+34%' },
    ],
    columns: ['Candidate', 'Employer', 'Milestone', 'Verification Date', 'Income', 'Status', 'Grievance / Safety'],
    mockData: [
      { candidate: 'Priya Sharma', employer: 'Even Cargo Logistics', milestone: '12 MONTHS', date: '2026-03-15', income: '₹19,200', status: 'Retained', safety: 'No Incidents' },
      { candidate: 'Neha Singh', employer: 'EV Mobility Solutions', milestone: '6 MONTHS', date: '2026-04-20', income: '₹19,500', status: 'Retained', safety: 'Resolved' },
    ]
  },
  partners: {
    title: 'Organizations & Partner Network',
    subtitle: 'Manage partner NGOs, SHG networks, government bodies, and training institutions.',
    icon: Handshake,
    kpis: [
      { label: 'Total Partners', value: '64' },
      { label: 'NGO Partners', value: '28' },
      { label: 'SHG Federations', value: '22' },
      { label: 'Government Bodies', value: '14' },
    ],
    columns: ['Partner Name', 'Type', 'City / State', 'Assigned Mobilizers', 'Candidates Mobilized', 'Status'],
    mockData: [
      { name: 'Mahila Vikas Samiti (NGO)', type: 'NGO Partner', city: 'Lucknow, UP', mobs: '4', candidates: '480', status: 'Active' },
      { name: 'UP Skill Development Mission', type: 'Govt Agency', city: 'Uttar Pradesh', mobs: '8', candidates: '1,240', status: 'Active' },
      { name: 'Sakhi Self Help Federation', type: 'SHG Network', city: 'Kanpur, UP', mobs: '3', candidates: '350', status: 'Active' },
    ]
  },
  'user-management': {
    title: 'Super Admin User & Access Hub',
    subtitle: 'Platform administrators, mobilizers, trainers, and placement coordinators credential management.',
    icon: UserCog,
    kpis: [
      { label: 'Active Platform Users', value: '684' },
      { label: 'Super Admins', value: '6' },
      { label: 'Mobilisers', value: '286' },
      { label: 'Trainers', value: '124' },
    ],
    columns: ['Name', 'Email', 'Role', 'Organization', 'Status', 'Last Login'],
    mockData: [
      { name: 'Super Admin', email: 'admin@eventransparency.org', role: 'Super Admin', org: 'Even Transparency HQ', status: 'Active', login: 'Just now' },
      { name: 'Anil Mishra', email: 'anil.mishra@eventransparency.org', role: 'Mobiliser', org: 'Mahila Vikas Samiti', status: 'Active', login: '10 min ago' },
      { name: 'Rahul Sharma', email: 'rahul.sharma@eventransparency.org', role: 'Trainer', org: 'Lucknow Skill Hub', status: 'Active', login: '45 min ago' },
    ]
  },
  'audit-logs': {
    title: 'System Audit Logs & Traceability',
    subtitle: 'Immutable record of candidate stage changes, score overrides, access attempts, and administrative actions.',
    icon: ScrollText,
    kpis: [
      { label: 'Total Events', value: '124,580' },
      { label: 'Stage Transitions', value: '42,120' },
      { label: 'Admin Overrides', value: '38' },
      { label: 'Security Status', value: 'Verified 100%' },
    ],
    columns: ['Timestamp', 'User', 'Action', 'Entity', 'Details', 'IP Address'],
    mockData: [
      { time: '10:15 AM', user: 'admin@eventransparency.org', action: 'CREATE_TRAINER', entity: 'Trainer: Rahul Sharma', details: 'Added new technical trainer record', ip: '127.0.0.1' },
      { time: '09:45 AM', user: 'admin@eventransparency.org', action: 'CREATE_BATCH', entity: 'Batch: MOB-2026-018', details: 'Initialized training batch with 25 candidate slots', ip: '127.0.0.1' },
      { time: '09:20 AM', user: 'meena.yadav@eventransparency.org', action: 'STAGE_CHANGE', entity: 'Candidate: ET-2026-001', details: 'Stage updated: IN_TRAINING -> READY_FOR_DEPLOYMENT', ip: '10.0.0.12' },
      { time: '08:55 AM', user: 'admin@eventransparency.org', action: 'ONBOARD_EMPLOYER', entity: 'Even Cargo Logistics', details: 'Verified corporate KYC and hiring mandate', ip: '127.0.0.1' },
    ]
  },
  settings: {
    title: 'Platform Master Configuration',
    subtitle: 'Configuration for lifecycle stages, NF scoring thresholds, document verification rules, and automated notifications.',
    icon: Settings,
    kpis: [
      { label: 'Lifecycle Stages', value: '7 Active' },
      { label: 'Document Rules', value: '14 Active' },
      { label: 'NF Engine Version', value: 'v3.2 Production' },
      { label: 'API Health', value: '100% Online' },
    ],
    columns: ['Category', 'Code', 'Label', 'Description', 'Active Status'],
    mockData: [
      { cat: 'LIFECYCLE_STAGE', code: 'STG_REG', label: 'Registered', desc: 'Mobilised candidate registered in platform', status: 'Active' },
      { cat: 'LIFECYCLE_STAGE', code: 'STG_VER', label: 'Verified', desc: 'Identity and preliminary KYC cleared', status: 'Active' },
      { cat: 'DOCUMENT_TYPE', code: 'DOC_DL', label: 'Driving Licence', desc: 'Mandatory 2W permanent or learner licence', status: 'Active' },
      { cat: 'DOCUMENT_TYPE', code: 'DOC_AADHAAR', label: 'Aadhaar Card', desc: 'UIDAI biometric identity document', status: 'Active' },
    ]
  }
};

export default function GenericAdminSection({ sectionId, onSectionChange }) {
  const config = SECTION_CONFIGS[sectionId] || SECTION_CONFIGS.candidates;
  const Icon = config.icon || Users;

  return (
    <div className="space-y-6 pb-12">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF8FA] border border-[#FF408A]/30 flex items-center justify-center text-[#FF408A] shrink-0 shadow-2xs">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-kaiseiTokumin tracking-tight">
              {config.title}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{config.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button className="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition shadow-2xs">
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {config.kpis.map((kpi, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold uppercase text-slate-400">{kpi.label}</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${config.title.toLowerCase()}...`}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#FF408A] bg-slate-50/50"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">Showing active system records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-200">
              <tr>
                {config.columns.map((col, idx) => (
                  <th key={idx} className="px-5 py-3.5">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {config.mockData.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                  {Object.values(row).map((val, cIdx) => (
                    <td key={cIdx} className="px-5 py-3.5 font-medium text-slate-700">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
