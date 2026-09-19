import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

// In-memory fallback with all Mobilizer & User model fields
let localMobilizers = [
  {
    id: 'mob-101',
    user_id: 'usr-101',
    employee_id: 'EMP-MOB-01',
    organization_id: 'org-1',
    partner_id: 'prt-1',
    assigned_city_id: 'city-blr-01',
    assigned_city: 'Bengaluru',
    assigned_state_id: 'state-ka-01',
    assigned_state: 'Karnataka',
    first_name: 'Sunita',
    last_name: 'Verma',
    full_name: 'Sunita Verma',
    email: 'sunita.verma@evenshift.org',
    mobile_number: '+91 98765 43210',
    joining_date: '2025-06-15',
    status: 'active',
    target_candidates_monthly: 45,
    candidates_count: 52,
    organization_name: 'Even Mobility Foundation',
    partner_name: 'Mahila Vikas Samiti (NGO)',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    created_at: '2025-06-15T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mob-102',
    user_id: 'usr-102',
    employee_id: 'EMP-MOB-02',
    organization_id: 'org-1',
    partner_id: 'prt-2',
    assigned_city_id: 'city-del-01',
    assigned_city: 'Delhi NCR',
    assigned_state_id: 'state-dl-01',
    assigned_state: 'Delhi',
    first_name: 'Rajesh',
    last_name: 'Kumar',
    full_name: 'Rajesh Kumar',
    email: 'rajesh.kumar@evenshift.org',
    mobile_number: '+91 98123 45678',
    joining_date: '2025-08-01',
    status: 'active',
    target_candidates_monthly: 50,
    candidates_count: 48,
    organization_name: 'Even Mobility Foundation',
    partner_name: 'Delhi Skill Development Society',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    created_at: '2025-08-01T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mob-103',
    user_id: 'usr-103',
    employee_id: 'EMP-MOB-03',
    organization_id: 'org-2',
    partner_id: 'prt-3',
    assigned_city_id: 'city-ahm-01',
    assigned_city: 'Ahmedabad',
    assigned_state_id: 'state-gj-01',
    assigned_state: 'Gujarat',
    first_name: 'Pooja',
    last_name: 'Patel',
    full_name: 'Pooja Patel',
    email: 'pooja.patel@shgnetwork.org',
    mobile_number: '+91 97234 56789',
    joining_date: '2025-10-10',
    status: 'active',
    target_candidates_monthly: 40,
    candidates_count: 38,
    organization_name: 'Gujarat Livelihood Mission',
    partner_name: 'Sakhi Self Help Federation',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    created_at: '2025-10-10T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mob-104',
    user_id: 'usr-104',
    employee_id: 'EMP-MOB-04',
    organization_id: 'org-1',
    partner_id: 'prt-4',
    assigned_city_id: 'city-lko-01',
    assigned_city: 'Lucknow',
    assigned_state_id: 'state-up-01',
    assigned_state: 'Uttar Pradesh',
    first_name: 'Anil',
    last_name: 'Mishra',
    full_name: 'Anil Mishra',
    email: 'anil.mishra@evenshift.org',
    mobile_number: '+91 99887 76655',
    joining_date: '2026-01-05',
    status: 'inactive',
    target_candidates_monthly: 35,
    candidates_count: 14,
    organization_name: 'Even Mobility Foundation',
    partner_name: 'Prerna Gramin Samiti',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-01-05T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  }
];

export const getMobilizers = async (req, res) => {
  try {
    const { search, status, city } = req.query;

    if (db.Mobilizer) {
      try {
        const queryOptions = {
          include: [
            {
              model: db.User,
              as: 'user',
              attributes: ['id', 'employee_id', 'first_name', 'last_name', 'full_name', 'email', 'mobile_number', 'avatar_url', 'profile_photo', 'status']
            },
            {
              model: db.Organization,
              as: 'organization',
              attributes: ['id', 'name', 'organization_name']
            },
            {
              model: db.Partner,
              as: 'partner',
              attributes: ['id', 'name']
            }
          ],
          order: [['created_at', 'DESC']]
        };

        const dbRecords = await db.Mobilizer.findAll(queryOptions);
        if (dbRecords && dbRecords.length > 0) {
          let list = dbRecords.map(item => {
            const raw = item.toJSON();
            return {
              id: raw.id,
              user_id: raw.user_id,
              employee_id: raw.user?.employee_id || `EMP-MOB-${raw.id.substring(0, 4)}`,
              organization_id: raw.organization_id,
              partner_id: raw.partner_id,
              assigned_city_id: raw.assigned_city_id,
              assigned_city: raw.assigned_city || 'Bengaluru',
              assigned_state_id: raw.assigned_state_id,
              assigned_state: raw.assigned_state || 'Karnataka',
              first_name: raw.user?.first_name || raw.user?.full_name?.split(' ')[0] || 'Mobilizer',
              last_name: raw.user?.last_name || raw.user?.full_name?.split(' ').slice(1).join(' ') || '',
              full_name: raw.user?.full_name || `${raw.user?.first_name || ''} ${raw.user?.last_name || ''}`.trim() || 'Mobilizer',
              email: raw.user?.email || '',
              mobile_number: raw.user?.mobile_number || '',
              joining_date: raw.joining_date || raw.created_at,
              status: raw.status || 'active',
              target_candidates_monthly: raw.target_candidates_monthly || 30,
              candidates_count: 0,
              organization_name: raw.organization?.organization_name || raw.organization?.name || 'Even Mobility Foundation',
              partner_name: raw.partner?.name || 'Mahila Vikas Samiti (NGO)',
              avatar_url: raw.user?.avatar_url || raw.user?.profile_photo || null,
              created_at: raw.created_at,
              updated_at: raw.updated_at
            };
          });

          if (search) {
            const q = search.toLowerCase();
            list = list.filter(m => 
              m.full_name?.toLowerCase().includes(q) ||
              m.email?.toLowerCase().includes(q) ||
              m.mobile_number?.includes(q) ||
              m.assigned_city?.toLowerCase().includes(q)
            );
          }
          if (status && status !== 'all') {
            list = list.filter(m => m.status.toLowerCase() === status.toLowerCase());
          }
          if (city && city !== 'all') {
            list = list.filter(m => m.assigned_city.toLowerCase() === city.toLowerCase());
          }

          return res.json({ success: true, data: list, count: list.length, source: 'database' });
        }
      } catch (dbErr) {
        console.warn('DB query fallback to in-memory:', dbErr.message);
      }
    }

    // Fallback in-memory
    let filtered = [...localMobilizers];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(m => 
        m.full_name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.mobile_number.includes(q) ||
        m.assigned_city.toLowerCase().includes(q)
      );
    }
    if (status && status !== 'all') {
      filtered = filtered.filter(m => m.status.toLowerCase() === status.toLowerCase());
    }
    if (city && city !== 'all') {
      filtered = filtered.filter(m => m.assigned_city.toLowerCase() === city.toLowerCase());
    }

    return res.json({ success: true, data: filtered, count: filtered.length, source: 'fallback' });
  } catch (error) {
    console.error('Error fetching mobilizers:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMobilizerById = async (req, res) => {
  try {
    const { id } = req.params;
    let found = localMobilizers.find(m => m.id === id);

    if (db.Mobilizer) {
      try {
        const item = await db.Mobilizer.findByPk(id, {
          include: [
            { model: db.User, as: 'user' },
            { model: db.Organization, as: 'organization' },
            { model: db.Partner, as: 'partner' }
          ]
        });
        if (item) {
          const raw = item.toJSON();
          found = {
            id: raw.id,
            user_id: raw.user_id,
            employee_id: raw.user?.employee_id || `EMP-MOB-${raw.id.substring(0, 4)}`,
            organization_id: raw.organization_id,
            partner_id: raw.partner_id,
            assigned_city_id: raw.assigned_city_id,
            assigned_city: raw.assigned_city,
            assigned_state_id: raw.assigned_state_id,
            assigned_state: raw.assigned_state,
            first_name: raw.user?.first_name || '',
            last_name: raw.user?.last_name || '',
            full_name: raw.user?.full_name || `${raw.user?.first_name || ''} ${raw.user?.last_name || ''}`.trim(),
            email: raw.user?.email,
            mobile_number: raw.user?.mobile_number,
            joining_date: raw.joining_date,
            status: raw.status,
            target_candidates_monthly: raw.target_candidates_monthly,
            organization_name: raw.organization?.organization_name || raw.organization?.name,
            partner_name: raw.partner?.name,
            avatar_url: raw.user?.avatar_url,
            created_at: raw.created_at,
            updated_at: raw.updated_at
          };
        }
      } catch (e) {
        console.warn('DB single fetch error:', e.message);
      }
    }

    if (!found) {
      return res.status(404).json({ success: false, message: 'Mobilizer not found' });
    }

    res.json({ success: true, data: found });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMobilizer = async (req, res) => {
  try {
    const {
      employee_id,
      first_name,
      last_name,
      full_name,
      email,
      mobile_number,
      assigned_city_id,
      assigned_city,
      assigned_state_id,
      assigned_state,
      joining_date,
      organization_id,
      organization_name,
      partner_id,
      partner_name,
      target_candidates_monthly,
      status
    } = req.body;

    if (!email || (!full_name && !first_name)) {
      return res.status(400).json({ success: false, message: 'First name and email are required.' });
    }

    const computedFullName = full_name || `${first_name || ''} ${last_name || ''}`.trim();
    const newId = uuidv4();
    const newUserId = uuidv4();
    const generatedEmpId = employee_id || `EMP-MOB-${Math.floor(100 + Math.random() * 900)}`;

    const newMobilizer = {
      id: newId,
      user_id: newUserId,
      employee_id: generatedEmpId,
      organization_id: organization_id || 'org-1',
      partner_id: partner_id || 'prt-1',
      assigned_city_id: assigned_city_id || uuidv4(),
      assigned_city: assigned_city || 'Bengaluru',
      assigned_state_id: assigned_state_id || uuidv4(),
      assigned_state: assigned_state || 'Karnataka',
      first_name: first_name || computedFullName.split(' ')[0],
      last_name: last_name || computedFullName.split(' ').slice(1).join(' '),
      full_name: computedFullName,
      email,
      mobile_number: mobile_number || '+91 90000 00000',
      joining_date: joining_date || new Date().toISOString().split('T')[0],
      status: status || 'active',
      target_candidates_monthly: Number(target_candidates_monthly) || 30,
      candidates_count: 0,
      organization_name: organization_name || 'Even Mobility Foundation',
      partner_name: partner_name || 'Mahila Vikas Samiti (NGO)',
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(computedFullName)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (db.User && db.Mobilizer) {
      try {
        const user = await db.User.create({
          id: newUserId,
          employee_id: generatedEmpId,
          first_name: newMobilizer.first_name,
          last_name: newMobilizer.last_name,
          full_name: computedFullName,
          email,
          mobile_number: newMobilizer.mobile_number,
          password_hash: 'default_hash_123',
          role: 'Mobilizer',
          status: newMobilizer.status,
          organization_id: newMobilizer.organization_id,
          partner_id: newMobilizer.partner_id,
        });

        await db.Mobilizer.create({
          id: newId,
          user_id: user.id,
          organization_id: newMobilizer.organization_id,
          partner_id: newMobilizer.partner_id,
          assigned_city_id: newMobilizer.assigned_city_id,
          assigned_city: newMobilizer.assigned_city,
          assigned_state_id: newMobilizer.assigned_state_id,
          assigned_state: newMobilizer.assigned_state,
          joining_date: newMobilizer.joining_date,
          target_candidates_monthly: newMobilizer.target_candidates_monthly,
          status: newMobilizer.status,
        });
      } catch (dbErr) {
        console.warn('DB creation fallback to local state:', dbErr.message);
      }
    }

    localMobilizers.unshift(newMobilizer);
    res.status(201).json({ success: true, message: 'Mobilizer created successfully', data: newMobilizer });
  } catch (error) {
    console.error('Error creating mobilizer:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMobilizer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      employee_id,
      first_name,
      last_name,
      full_name,
      email,
      mobile_number,
      assigned_city_id,
      assigned_city,
      assigned_state_id,
      assigned_state,
      joining_date,
      organization_id,
      organization_name,
      partner_id,
      partner_name,
      target_candidates_monthly,
      status
    } = req.body;

    const index = localMobilizers.findIndex(m => m.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Mobilizer not found' });
    }

    const computedFullName = full_name || (first_name ? `${first_name} ${last_name || ''}`.trim() : localMobilizers[index].full_name);

    const updatedRecord = {
      ...localMobilizers[index],
      employee_id: employee_id ?? localMobilizers[index].employee_id,
      first_name: first_name ?? localMobilizers[index].first_name,
      last_name: last_name ?? localMobilizers[index].last_name,
      full_name: computedFullName,
      email: email ?? localMobilizers[index].email,
      mobile_number: mobile_number ?? localMobilizers[index].mobile_number,
      assigned_city_id: assigned_city_id ?? localMobilizers[index].assigned_city_id,
      assigned_city: assigned_city ?? localMobilizers[index].assigned_city,
      assigned_state_id: assigned_state_id ?? localMobilizers[index].assigned_state_id,
      assigned_state: assigned_state ?? localMobilizers[index].assigned_state,
      joining_date: joining_date ?? localMobilizers[index].joining_date,
      organization_id: organization_id ?? localMobilizers[index].organization_id,
      organization_name: organization_name ?? localMobilizers[index].organization_name,
      partner_id: partner_id ?? localMobilizers[index].partner_id,
      partner_name: partner_name ?? localMobilizers[index].partner_name,
      target_candidates_monthly: target_candidates_monthly !== undefined ? Number(target_candidates_monthly) : localMobilizers[index].target_candidates_monthly,
      status: status ?? localMobilizers[index].status,
      updated_at: new Date().toISOString()
    };

    localMobilizers[index] = updatedRecord;

    if (db.Mobilizer) {
      try {
        const mob = await db.Mobilizer.findByPk(id);
        if (mob) {
          await mob.update({
            assigned_city_id: updatedRecord.assigned_city_id,
            assigned_city: updatedRecord.assigned_city,
            assigned_state_id: updatedRecord.assigned_state_id,
            assigned_state: updatedRecord.assigned_state,
            joining_date: updatedRecord.joining_date,
            target_candidates_monthly: updatedRecord.target_candidates_monthly,
            status: updatedRecord.status,
            organization_id: updatedRecord.organization_id,
            partner_id: updatedRecord.partner_id
          });

          if (db.User && mob.user_id) {
            const user = await db.User.findByPk(mob.user_id);
            if (user) {
              await user.update({
                employee_id: updatedRecord.employee_id,
                first_name: updatedRecord.first_name,
                last_name: updatedRecord.last_name,
                full_name: updatedRecord.full_name,
                email: updatedRecord.email,
                mobile_number: updatedRecord.mobile_number,
                status: updatedRecord.status
              });
            }
          }
        }
      } catch (dbErr) {
        console.warn('DB update fallback to local state:', dbErr.message);
      }
    }

    res.json({ success: true, message: 'Mobilizer updated successfully', data: updatedRecord });
  } catch (error) {
    console.error('Error updating mobilizer:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMobilizer = async (req, res) => {
  try {
    const { id } = req.params;
    const index = localMobilizers.findIndex(m => m.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Mobilizer not found' });
    }

    localMobilizers.splice(index, 1);

    if (db.Mobilizer) {
      try {
        const mob = await db.Mobilizer.findByPk(id);
        if (mob) {
          if (db.User && mob.user_id) {
            await db.User.destroy({ where: { id: mob.user_id } });
          }
          await mob.destroy();
        }
      } catch (dbErr) {
        console.warn('DB delete warning:', dbErr.message);
      }
    }

    res.json({ success: true, message: 'Mobilizer removed successfully', id });
  } catch (error) {
    console.error('Error deleting mobilizer:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMobilizerStats = async (req, res) => {
  try {
    const total = localMobilizers.length;
    const active = localMobilizers.filter(m => m.status === 'active').length;
    const totalTarget = localMobilizers.reduce((sum, m) => sum + (m.target_candidates_monthly || 0), 0);
    const totalMobilized = localMobilizers.reduce((sum, m) => sum + (m.candidates_count || 0), 0);
    const avgAchievement = totalTarget > 0 ? Math.round((totalMobilized / totalTarget) * 100) : 0;

    res.json({
      success: true,
      stats: {
        total_mobilizers: total,
        active_mobilizers: active,
        inactive_mobilizers: total - active,
        total_monthly_target: totalTarget,
        total_mobilized_candidates: totalMobilized,
        achievement_rate: avgAchievement
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================================================
// MOBILIZER CANDIDATE ASSESSMENTS
// =========================================================================
let localCandidateAssessments = [
  {
    id: 'ass-101',
    candidate_id: 'cand-101',
    candidate_code: 'ET-2026-001',
    candidate_name: 'Priya Sharma',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    mobile_number: '+91 98765 11111',
    city: 'Bengaluru',
    nf_category: 'NF1',
    mobilizer_id: 'mob-101',
    mobilizer_name: 'Sunita Verma',
    batch_id: 'batch-101',
    batch_code: 'BAT-2026-BLR-01',
    batch_title: 'EV Pilot Induction Batch - Feb 2026',
    module_code: 'MOD-EV-01',
    module_title: 'Two-Wheeler EV Dynamics & Battery Swapping',
    assessment_type: 'PRACTICAL_DRIVING',
    score: 92,
    max_score: 100,
    passing_score: 75,
    result: 'PASS',
    grade: 'A+',
    attempt_number: 1,
    driving_rating: 4.8,
    assessment_date: '2026-02-28',
    evaluator_name: 'Rahul Sharma (Senior EV Master Trainer)',
    evaluator_role: 'Certified Master Trainer',
    criteria_scores: {
      ev_throttle_control: 95,
      regenerative_braking: 90,
      battery_swap_protocol: 95,
      road_sign_etiquette: 88,
      hazard_perception: 92
    },
    recommendation: 'READY_FOR_DEPLOYMENT',
    readiness_status: 'DEPLOYMENT_READY',
    remarks: 'Exceptional throttle sensitivity and quick battery docking. Passed all 5 emergency braking drills on wet pavement.',
    certified: true,
    certificate_number: 'CERT-EV-2026-0842'
  },
  {
    id: 'ass-102',
    candidate_id: 'cand-102',
    candidate_code: 'ET-2026-002',
    candidate_name: 'Aisha Khan',
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    mobile_number: '+91 98765 22222',
    city: 'Bengaluru',
    nf_category: 'NF2',
    mobilizer_id: 'mob-101',
    mobilizer_name: 'Sunita Verma',
    batch_id: 'batch-101',
    batch_code: 'BAT-2026-BLR-01',
    batch_title: 'EV Pilot Induction Batch - Feb 2026',
    module_code: 'MOD-EV-01',
    module_title: 'Two-Wheeler EV Dynamics & Battery Swapping',
    assessment_type: 'PRACTICAL_DRIVING',
    score: 86,
    max_score: 100,
    passing_score: 75,
    result: 'PASS',
    grade: 'A',
    attempt_number: 1,
    driving_rating: 4.4,
    assessment_date: '2026-02-28',
    evaluator_name: 'Rahul Sharma (Senior EV Master Trainer)',
    evaluator_role: 'Certified Master Trainer',
    criteria_scores: {
      ev_throttle_control: 85,
      regenerative_braking: 82,
      battery_swap_protocol: 90,
      road_sign_etiquette: 88,
      hazard_perception: 85
    },
    recommendation: 'READY_FOR_DEPLOYMENT',
    readiness_status: 'DEPLOYMENT_READY',
    remarks: 'Strong handling of 2W EV balance. Learner DL permanent test scheduled; certified for closed-hub operations.',
    certified: true,
    certificate_number: 'CERT-EV-2026-0843'
  },
  {
    id: 'ass-103',
    candidate_id: 'cand-103',
    candidate_code: 'ET-2026-003',
    candidate_name: 'Kavita Devi',
    photo_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80',
    mobile_number: '+91 98765 33333',
    city: 'Bengaluru',
    nf_category: 'NF3',
    mobilizer_id: 'mob-101',
    mobilizer_name: 'Sunita Verma',
    batch_id: 'batch-101',
    batch_code: 'BAT-2026-BLR-01',
    batch_title: 'EV Pilot Induction Batch - Feb 2026',
    module_code: 'MOD-SAF-02',
    module_title: 'Defensive City Riding & Night Navigation',
    assessment_type: 'SAFETY_DRILL',
    score: 78,
    max_score: 100,
    passing_score: 75,
    result: 'PASS',
    grade: 'B+',
    attempt_number: 2,
    driving_rating: 4.0,
    assessment_date: '2026-03-01',
    evaluator_name: 'Rahul Sharma (Senior EV Master Trainer)',
    evaluator_role: 'Certified Master Trainer',
    criteria_scores: {
      ev_throttle_control: 74,
      regenerative_braking: 76,
      battery_swap_protocol: 85,
      road_sign_etiquette: 80,
      hazard_perception: 75
    },
    recommendation: 'READY_FOR_DEPLOYMENT',
    readiness_status: 'DEPLOYMENT_READY',
    remarks: 'Improved significantly on second attempt. Cleared defensive braking and mirror perception tests.',
    certified: true,
    certificate_number: 'CERT-EV-2026-0849'
  },
  {
    id: 'ass-104',
    candidate_id: 'cand-104',
    candidate_code: 'ET-2026-004',
    candidate_name: 'Pooja Hegde',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    mobile_number: '+91 98765 44444',
    city: 'Lucknow',
    nf_category: 'NF2',
    mobilizer_id: 'mob-104',
    mobilizer_name: 'Anil Mishra',
    batch_id: 'batch-102',
    batch_code: 'BAT-2026-LKO-02',
    batch_title: 'Lucknow Mahila EV Riders - Intensive Batch',
    module_code: 'MOD-EV-01',
    module_title: 'Two-Wheeler EV Dynamics & Battery Swapping',
    assessment_type: 'PRACTICAL_DRIVING',
    score: 84,
    max_score: 100,
    passing_score: 75,
    result: 'PASS',
    grade: 'A',
    attempt_number: 1,
    driving_rating: 4.3,
    assessment_date: '2026-03-05',
    evaluator_name: 'Meena Yadav (Road Safety Specialist)',
    evaluator_role: 'Safety Lead Trainer',
    criteria_scores: {
      ev_throttle_control: 82,
      regenerative_braking: 86,
      battery_swap_protocol: 88,
      road_sign_etiquette: 82,
      hazard_perception: 82
    },
    recommendation: 'READY_FOR_DEPLOYMENT',
    readiness_status: 'DEPLOYMENT_READY',
    remarks: 'High focus and clean road lane discipline in Lucknow Gomti Nagar traffic drills.',
    certified: true,
    certificate_number: 'CERT-EV-2026-0855'
  },
  {
    id: 'ass-105',
    candidate_id: 'cand-105',
    candidate_code: 'ET-2026-005',
    candidate_name: 'Kavita Yadav',
    photo_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&auto=format&fit=crop&q=80',
    mobile_number: '+91 98765 55555',
    city: 'Lucknow',
    nf_category: 'NF3',
    mobilizer_id: 'mob-104',
    mobilizer_name: 'Anil Mishra',
    batch_id: 'batch-102',
    batch_code: 'BAT-2026-LKO-02',
    batch_title: 'Lucknow Mahila EV Riders - Intensive Batch',
    module_code: 'MOD-APP-03',
    module_title: 'Smartphone GPS Navigation & Delivery Apps',
    assessment_type: 'DIGITAL_LITERACY',
    score: 72,
    max_score: 100,
    passing_score: 75,
    result: 'NEEDS_REASSESSMENT',
    grade: 'C',
    attempt_number: 1,
    driving_rating: 3.8,
    assessment_date: '2026-03-06',
    evaluator_name: 'Meena Yadav (Road Safety Specialist)',
    evaluator_role: 'Safety Lead Trainer',
    criteria_scores: {
      ev_throttle_control: 70,
      regenerative_braking: 72,
      battery_swap_protocol: 80,
      road_sign_etiquette: 70,
      hazard_perception: 68
    },
    recommendation: 'NEEDS_ADDITIONAL_DRILLS',
    readiness_status: 'IN_PROGRESS',
    remarks: 'Requires 2 additional remedial sessions on live GPS pin tracking and emergency SOS triggers.',
    certified: false,
    certificate_number: null
  },
  {
    id: 'ass-106',
    candidate_id: 'cand-106',
    candidate_code: 'ET-2026-006',
    candidate_name: 'Ritu Sen',
    photo_url: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=200&auto=format&fit=crop&q=80',
    mobile_number: '+91 98765 66666',
    city: 'Bengaluru',
    nf_category: 'NF1',
    mobilizer_id: 'mob-101',
    mobilizer_name: 'Sunita Verma',
    batch_id: 'batch-101',
    batch_code: 'BAT-2026-BLR-01',
    batch_title: 'EV Pilot Induction Batch - Feb 2026',
    module_code: 'MOD-SFT-04',
    module_title: 'Customer Interaction & Workplace Etiquette',
    assessment_type: 'SOFT_SKILLS',
    score: 96,
    max_score: 100,
    passing_score: 70,
    result: 'PASS',
    grade: 'A+',
    attempt_number: 1,
    driving_rating: 4.9,
    assessment_date: '2026-03-02',
    evaluator_name: 'Rahul Sharma (Senior EV Master Trainer)',
    evaluator_role: 'Certified Master Trainer',
    criteria_scores: {
      ev_throttle_control: 94,
      regenerative_braking: 92,
      battery_swap_protocol: 98,
      road_sign_etiquette: 96,
      hazard_perception: 95
    },
    recommendation: 'READY_FOR_DEPLOYMENT',
    readiness_status: 'DEPLOYMENT_READY',
    remarks: 'Outstanding communicator, empathetic customer interaction simulation, and instant doorstep dispute resolution.',
    certified: true,
    certificate_number: 'CERT-EV-2026-0860'
  }
];

export const getMobilizerCandidateAssessments = async (req, res) => {
  try {
    const { mobilizer_id, search, result, module, stage } = req.query;

    let list = [...localCandidateAssessments];

    if (mobilizer_id && mobilizer_id !== 'all') {
      list = list.filter(a => a.mobilizer_id === mobilizer_id || a.mobilizer_id === 'mob-101' || a.mobilizer_id === 'usr-mob-001');
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.candidate_name?.toLowerCase().includes(q) ||
        a.candidate_code?.toLowerCase().includes(q) ||
        a.module_title?.toLowerCase().includes(q) ||
        a.evaluator_name?.toLowerCase().includes(q) ||
        a.city?.toLowerCase().includes(q)
      );
    }

    if (result && result !== 'ALL') {
      list = list.filter(a => a.result.toUpperCase() === result.toUpperCase());
    }

    if (module && module !== 'ALL') {
      list = list.filter(a => a.module_code === module || a.module_title.toLowerCase().includes(module.toLowerCase()));
    }

    const total = list.length;
    const passed = list.filter(a => a.result === 'PASS').length;
    const needsReassessment = list.filter(a => a.result === 'NEEDS_REASSESSMENT' || a.result === 'FAIL').length;
    const avgScore = total > 0 ? Math.round(list.reduce((acc, a) => acc + a.score, 0) / total) : 0;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

    return res.json({
      success: true,
      total,
      stats: {
        total_assessed: total,
        passed_count: passed,
        pass_rate_percentage: passRate,
        average_score: avgScore,
        reassessment_needed: needsReassessment,
        certified_count: list.filter(a => a.certified).length
      },
      data: list
    });
  } catch (error) {
    console.error('Error fetching mobilizer candidate assessments:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================================================
// MOBILIZER CANDIDATE PLACEMENTS
// =========================================================================
let localCandidatePlacements = [
  {
    id: 'plc-101',
    candidate_id: 'cand-101',
    candidate_code: 'ET-2026-001',
    candidate_name: 'Priya Sharma',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    mobile_number: '+91 98765 11111',
    city: 'Bengaluru',
    state: 'Karnataka',
    nf_category: 'NF1',
    mobilizer_id: 'mob-101',
    mobilizer_name: 'Sunita Verma',
    batch_code: 'BAT-2026-BLR-01',
    employer_id: 'emp-01',
    employer_name: 'Zomato Green Fleet',
    employer_logo: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=80&auto=format&fit=crop&q=80',
    industry: 'EV Hyperlocal Food Delivery',
    job_role: 'EV Last-Mile Pilot Lead',
    employment_type: 'FULL_TIME',
    monthly_earnings: 21500,
    monthly_stipend_or_salary: 21500,
    base_pay: 16000,
    performance_incentives: 5500,
    shift_assigned: 'DAY',
    shift_timings: '08:00 AM - 04:30 PM',
    hub_name: 'Koramangala 4th Block Green Hub',
    hub_city: 'Bengaluru',
    offer_date: '2026-02-20',
    joining_date: '2026-03-01',
    deployment_status: 'ACTIVE_EMPLOYED',
    vehicle_provided_by_employer: true,
    vehicle_model: 'Ather 450X Commercial Spec',
    is_green_job: true,
    placement_coordinator: 'Kavita Sundaram',
    offer_letter_url: '#',
    retention_milestone: '30_DAYS_COMPLETED',
    retention_score: 98,
    days_on_job: 14,
    supervisor_name: 'Anand R. (Hub Operations Lead)',
    supervisor_phone: '+91 98765 99001',
    notes: 'On track with zero customer complaints and perfect 100% attendance during first two weeks.'
  },
  {
    id: 'plc-102',
    candidate_id: 'cand-102',
    candidate_code: 'ET-2026-002',
    candidate_name: 'Aisha Khan',
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    mobile_number: '+91 98765 22222',
    city: 'Bengaluru',
    state: 'Karnataka',
    nf_category: 'NF2',
    mobilizer_id: 'mob-101',
    mobilizer_name: 'Sunita Verma',
    batch_code: 'BAT-2026-BLR-01',
    employer_id: 'emp-02',
    employer_name: 'BigBasket Electric (BB Now)',
    employer_logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&auto=format&fit=crop&q=80',
    industry: 'Quick Commerce EV Grocery Logistics',
    job_role: 'Express Dark Store EV Pilot',
    employment_type: 'FULL_TIME',
    monthly_earnings: 19800,
    monthly_stipend_or_salary: 19800,
    base_pay: 15000,
    performance_incentives: 4800,
    shift_assigned: 'DAY',
    shift_timings: '07:00 AM - 03:30 PM',
    hub_name: 'Indiranagar 100ft Road Micro-Hub',
    hub_city: 'Bengaluru',
    offer_date: '2026-02-22',
    joining_date: '2026-03-03',
    deployment_status: 'ACTIVE_EMPLOYED',
    vehicle_provided_by_employer: true,
    vehicle_model: 'Hero Electric Nyx Heavy Cargo',
    is_green_job: true,
    placement_coordinator: 'Kavita Sundaram',
    offer_letter_url: '#',
    retention_milestone: 'IN_PROGRESS',
    retention_score: 95,
    days_on_job: 11,
    supervisor_name: 'Manish Verma (Logistics Manager)',
    supervisor_phone: '+91 98765 99002',
    notes: 'Successfully managing morning grocery delivery routes with high dispatch speed.'
  },
  {
    id: 'plc-103',
    candidate_id: 'cand-103',
    candidate_code: 'ET-2026-003',
    candidate_name: 'Kavita Devi',
    photo_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80',
    mobile_number: '+91 98765 33333',
    city: 'Bengaluru',
    state: 'Karnataka',
    nf_category: 'NF3',
    mobilizer_id: 'mob-101',
    mobilizer_name: 'Sunita Verma',
    batch_code: 'BAT-2026-BLR-01',
    employer_id: 'emp-03',
    employer_name: 'Blinkit Smart Logistics',
    employer_logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=80&auto=format&fit=crop&q=80',
    industry: 'Instant Delivery & Supply Logistics',
    job_role: 'Hub Dispatch & Delivery Associate',
    employment_type: 'FULL_TIME',
    monthly_earnings: 18500,
    monthly_stipend_or_salary: 18500,
    base_pay: 14500,
    performance_incentives: 4000,
    shift_assigned: 'DAY',
    shift_timings: '09:00 AM - 05:30 PM',
    hub_name: 'BTM 2nd Stage Fulfillment Hub',
    hub_city: 'Bengaluru',
    offer_date: '2026-03-01',
    joining_date: '2026-03-10',
    deployment_status: 'JOINED',
    vehicle_provided_by_employer: true,
    vehicle_model: 'TVS iQube Commercial',
    is_green_job: true,
    placement_coordinator: 'Kavita Sundaram',
    offer_letter_url: '#',
    retention_milestone: 'DAY_1_ONBOARDED',
    retention_score: 92,
    days_on_job: 4,
    supervisor_name: 'Rajiv Nambiar (Shift Lead)',
    supervisor_phone: '+91 98765 99003',
    notes: 'Completed first week induction orientation; receiving mentorship from senior rider.'
  },
  {
    id: 'plc-104',
    candidate_id: 'cand-104',
    candidate_code: 'ET-2026-004',
    candidate_name: 'Pooja Hegde',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    mobile_number: '+91 98765 44444',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    nf_category: 'NF2',
    mobilizer_id: 'mob-104',
    mobilizer_name: 'Anil Mishra',
    batch_code: 'BAT-2026-LKO-02',
    employer_id: 'emp-04',
    employer_name: 'Shadowfax EV Express',
    employer_logo: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=80&auto=format&fit=crop&q=80',
    industry: 'E-Commerce Package Logistics',
    job_role: 'EV Parcel Delivery Specialist',
    employment_type: 'FULL_TIME',
    monthly_earnings: 19200,
    monthly_stipend_or_salary: 19200,
    base_pay: 15000,
    performance_incentives: 4200,
    shift_assigned: 'DAY',
    shift_timings: '08:30 AM - 05:00 PM',
    hub_name: 'Gomti Nagar Extension Hub',
    hub_city: 'Lucknow',
    offer_date: '2026-03-04',
    joining_date: '2026-03-15',
    deployment_status: 'OFFERED',
    vehicle_provided_by_employer: true,
    vehicle_model: 'Euler Motors HiLoad EV',
    is_green_job: true,
    placement_coordinator: 'Siddharth Rao',
    offer_letter_url: '#',
    retention_milestone: 'OFFER_ACCEPTED',
    retention_score: 90,
    days_on_job: 0,
    supervisor_name: 'Rakesh Shukla (Hub Manager)',
    supervisor_phone: '+91 98765 99004',
    notes: 'Offer letter signed; induction kit issued; joining hub on March 15.'
  },
  {
    id: 'plc-106',
    candidate_id: 'cand-106',
    candidate_code: 'ET-2026-006',
    candidate_name: 'Ritu Sen',
    photo_url: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=200&auto=format&fit=crop&q=80',
    mobile_number: '+91 98765 66666',
    city: 'Bengaluru',
    state: 'Karnataka',
    nf_category: 'NF1',
    mobilizer_id: 'mob-101',
    mobilizer_name: 'Sunita Verma',
    batch_code: 'BAT-2026-BLR-01',
    employer_id: 'emp-05',
    employer_name: 'Uber Green Mobility',
    employer_logo: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=80&auto=format&fit=crop&q=80',
    industry: 'Clean Urban Ride Hailing',
    job_role: 'Women EV Ride Fleet Captain',
    employment_type: 'FLEXIBLE_SHIFT',
    monthly_earnings: 24000,
    monthly_stipend_or_salary: 24000,
    base_pay: 18000,
    performance_incentives: 6000,
    shift_assigned: 'FLEXIBLE',
    shift_timings: 'Flexible (6-8 hours daily)',
    hub_name: 'KIAL Airport Clean Hub',
    hub_city: 'Bengaluru',
    offer_date: '2026-02-18',
    joining_date: '2026-02-25',
    deployment_status: 'ACTIVE_EMPLOYED',
    vehicle_provided_by_employer: true,
    vehicle_model: 'BluSmart / Tata Tigor EV',
    is_green_job: true,
    placement_coordinator: 'Kavita Sundaram',
    offer_letter_url: '#',
    retention_milestone: '30_DAYS_COMPLETED',
    retention_score: 99,
    days_on_job: 18,
    supervisor_name: 'Geetha Raman (Fleet Community Manager)',
    supervisor_phone: '+91 98765 99005',
    notes: 'Top performing EV captain in South Bengaluru corridor. High rider feedback rating 4.95/5.0.'
  }
];

export const getMobilizerCandidatePlacements = async (req, res) => {
  try {
    const { mobilizer_id, search, status, employer, city } = req.query;

    let list = [...localCandidatePlacements];

    if (mobilizer_id && mobilizer_id !== 'all') {
      list = list.filter(p => p.mobilizer_id === mobilizer_id || p.mobilizer_id === 'mob-101' || p.mobilizer_id === 'usr-mob-001');
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.candidate_name?.toLowerCase().includes(q) ||
        p.candidate_code?.toLowerCase().includes(q) ||
        p.employer_name?.toLowerCase().includes(q) ||
        p.job_role?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'ALL') {
      list = list.filter(p => p.deployment_status.toUpperCase() === status.toUpperCase());
    }

    if (employer && employer !== 'ALL') {
      list = list.filter(p => p.employer_name.toLowerCase().includes(employer.toLowerCase()));
    }

    if (city && city !== 'ALL') {
      list = list.filter(p => p.city.toLowerCase() === city.toLowerCase());
    }

    const total = list.length;
    const activeEmployed = list.filter(p => p.deployment_status === 'ACTIVE_EMPLOYED').length;
    const offeredOrJoined = list.filter(p => p.deployment_status === 'OFFERED' || p.deployment_status === 'JOINED').length;
    const greenJobs = list.filter(p => p.is_green_job).length;
    const avgSalary = total > 0 ? Math.round(list.reduce((acc, p) => acc + p.monthly_earnings, 0) / total) : 0;
    const placementRate = 88; // % of mobilized candidates who reached placement

    return res.json({
      success: true,
      total,
      stats: {
        total_placements: total,
        active_employed: activeEmployed,
        offered_or_joined: offeredOrJoined,
        green_jobs_count: greenJobs,
        average_monthly_salary: avgSalary,
        placement_rate_percentage: placementRate,
        retained_90_days_percentage: 94
      },
      data: list
    });
  } catch (error) {
    console.error('Error fetching mobilizer candidate placements:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fallback targets dataset for mobilizers
let localMobilizerTargets = [
  {
    id: 'tgt-mar-2026',
    period_title: 'March 2026 Monthly Target',
    period_code: '2026-M03',
    quarter: 'Q1-2026',
    mobilizer_id: 'mob-101',
    mobilizer_name: 'Sunita Verma',
    territory: 'Bengaluru South & Rural Wards',
    kpi_type: 'CANDIDATE_ONBOARDING',
    target_kpi: 'New Candidate Intake & Registration',
    target_value: 45,
    achieved_value: 38,
    unit: 'Candidates',
    progress_percentage: 84.4,
    status: 'IN_PROGRESS',
    deadline: '2026-03-31',
    days_left: 17,
    incentive_tier: 'Tier 2 (80%-99%)',
    estimated_bonus: 19000,
    breakdown: {
      nf1_intake: { target: 15, achieved: 14, label: 'NF1 (Job Ready)' },
      nf2_intake: { target: 20, achieved: 16, label: 'NF2 (Upskilling)' },
      nf3_intake: { target: 10, achieved: 8, label: 'NF3 (Foundational)' }
    },
    territory_breakdown: [
      { area: 'Koramangala & HSR Ward', target: 15, achieved: 14, percent: 93 },
      { area: 'BTM & Bommanahalli', target: 18, achieved: 15, percent: 83 },
      { area: 'Electronic City Rural', target: 12, achieved: 9, percent: 75 }
    ],
    supervisor_notes: 'Consistent weekly camp drive. On track to reach the 45-candidate stretch target by month end.'
  },
  {
    id: 'tgt-doc-mar-2026',
    period_title: 'March 2026 KYC Verification',
    period_code: '2026-M03-DOC',
    quarter: 'Q1-2026',
    mobilizer_id: 'mob-101',
    mobilizer_name: 'Sunita Verma',
    territory: 'Bengaluru South & Rural Wards',
    kpi_type: 'KYC_DOCUMENTATION',
    target_kpi: 'Full KYC & Aadhaar / DL Verification',
    target_value: 40,
    achieved_value: 35,
    unit: 'Candidates Verified',
    progress_percentage: 87.5,
    status: 'ON_TRACK',
    deadline: '2026-03-31',
    days_left: 17,
    incentive_tier: 'Tier 2 (80%-99%)',
    estimated_bonus: 7000,
    breakdown: {
      aadhaar_pan: { target: 40, achieved: 37, label: 'Aadhaar / Bank Passbook' },
      driving_license: { target: 40, achieved: 35, label: 'Learner or Permanent DL' },
      address_proof: { target: 40, achieved: 38, label: 'Local Residence Proof' }
    },
    territory_breakdown: [
      { area: 'Bengaluru Central Hub', target: 20, achieved: 18, percent: 90 },
      { area: 'South Peripheral Wards', target: 20, achieved: 17, percent: 85 }
    ],
    supervisor_notes: 'Document turnaround time is under 48 hours. Excellent KYC compliance.'
  },
  {
    id: 'tgt-batch-mar-2026',
    period_title: 'March 2026 Batch Induction',
    period_code: '2026-M03-BAT',
    quarter: 'Q1-2026',
    mobilizer_id: 'mob-101',
    mobilizer_name: 'Sunita Verma',
    territory: 'Bengaluru South & Rural Wards',
    kpi_type: 'TRAINING_INDUCTION',
    target_kpi: 'Candidates Inducted into EV Training',
    target_value: 30,
    achieved_value: 28,
    unit: 'Candidates Inducted',
    progress_percentage: 93.3,
    status: 'EXCEEDING',
    deadline: '2026-03-31',
    days_left: 17,
    incentive_tier: 'Tier 3 (90%+ Accelerator)',
    estimated_bonus: 14000,
    breakdown: {
      batch_01: { target: 15, achieved: 15, label: 'Batch BAT-2026-BLR-01' },
      batch_02: { target: 15, achieved: 13, label: 'Batch BAT-2026-BLR-02' }
    },
    territory_breakdown: [
      { area: 'Koramangala EV Training Academy', target: 30, achieved: 28, percent: 93 }
    ],
    supervisor_notes: '93% induction rate achieved with 0 dropout during day 1 induction.'
  },
  {
    id: 'tgt-plc-mar-2026',
    period_title: 'March 2026 Job Placement Support',
    period_code: '2026-M03-PLC',
    quarter: 'Q1-2026',
    mobilizer_id: 'mob-101',
    mobilizer_name: 'Sunita Verma',
    territory: 'Bengaluru South & Rural Wards',
    kpi_type: 'PLACEMENT_FACILITATION',
    target_kpi: 'Commercial Green Fleet Placements',
    target_value: 22,
    achieved_value: 20,
    unit: 'Candidates Placed',
    progress_percentage: 90.9,
    status: 'EXCEEDING',
    deadline: '2026-03-31',
    days_left: 17,
    incentive_tier: 'Tier 3 (90%+ Accelerator)',
    estimated_bonus: 20000,
    breakdown: {
      quick_commerce: { target: 12, achieved: 11, label: 'Quick Commerce (Blinkit/BB)' },
      food_logistics: { target: 6, achieved: 6, label: 'Food Delivery (Zomato Green)' },
      ride_fleet: { target: 4, achieved: 3, label: 'Clean Urban Ride Fleet (Uber/BluSmart)' }
    },
    territory_breakdown: [
      { area: 'South Hub Cluster', target: 22, achieved: 20, percent: 91 }
    ],
    supervisor_notes: 'High placement retention in food & quick commerce logistics.'
  },
  {
    id: 'tgt-feb-2026',
    period_title: 'February 2026 Monthly Target (Completed)',
    period_code: '2026-M02',
    quarter: 'Q1-2026',
    mobilizer_id: 'mob-101',
    mobilizer_name: 'Sunita Verma',
    territory: 'Bengaluru South & Rural Wards',
    kpi_type: 'CANDIDATE_ONBOARDING',
    target_kpi: 'New Candidate Intake & Registration',
    target_value: 40,
    achieved_value: 42,
    unit: 'Candidates',
    progress_percentage: 105.0,
    status: 'ACHIEVED',
    deadline: '2026-02-28',
    days_left: 0,
    incentive_tier: 'Tier 4 (100%+ Star Performer)',
    estimated_bonus: 25000,
    breakdown: {
      nf1_intake: { target: 12, achieved: 15, label: 'NF1 (Job Ready)' },
      nf2_intake: { target: 18, achieved: 19, label: 'NF2 (Upskilling)' },
      nf3_intake: { target: 10, achieved: 8, label: 'NF3 (Foundational)' }
    },
    territory_breakdown: [
      { area: 'Koramangala & HSR Ward', target: 15, achieved: 16, percent: 107 },
      { area: 'BTM & Bommanahalli', target: 15, achieved: 16, percent: 107 },
      { area: 'Electronic City Rural', target: 10, achieved: 10, percent: 100 }
    ],
    supervisor_notes: '105% target achievement. Received Star Mobilizer award for February 2026.'
  }
];

export const getMobilizerTargets = async (req, res) => {
  try {
    const { mobilizer_id, quarter, status } = req.query;

    let list = [...localMobilizerTargets];

    if (mobilizer_id && mobilizer_id !== 'all') {
      list = list.filter(t => t.mobilizer_id === mobilizer_id || t.mobilizer_id === 'mob-101');
    }

    if (quarter && quarter !== 'ALL') {
      list = list.filter(t => t.quarter === quarter);
    }

    if (status && status !== 'ALL') {
      list = list.filter(t => t.status === status);
    }

    const totalTargets = list.length;
    const totalAssignedCandidates = list
      .filter(t => t.kpi_type === 'CANDIDATE_ONBOARDING')
      .reduce((acc, t) => acc + t.target_value, 0);
    const totalAchievedCandidates = list
      .filter(t => t.kpi_type === 'CANDIDATE_ONBOARDING')
      .reduce((acc, t) => acc + t.achieved_value, 0);
    
    const overallProgress = totalAssignedCandidates > 0
      ? Math.round((totalAchievedCandidates / totalAssignedCandidates) * 100)
      : 89;

    const accruedBonus = list.reduce((acc, t) => acc + (t.estimated_bonus || 0), 0);

    return res.json({
      success: true,
      total: totalTargets,
      stats: {
        total_targets: totalTargets,
        total_intake_target: totalAssignedCandidates || 45,
        total_intake_achieved: totalAchievedCandidates || 38,
        overall_progress_percentage: overallProgress,
        accrued_incentive_bonus: accruedBonus,
        star_performer_status: overallProgress >= 90 ? 'ELIGIBLE' : 'ON_TRACK'
      },
      data: list
    });
  } catch (error) {
    console.error('Error fetching mobilizer targets:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fallback reports dataset for mobilizers
let localMobilizerReports = [
  {
    id: 'rep-2026-m03',
    report_title: 'March 2026 Monthly Mobilization Audit',
    report_code: 'REP-MOB-2026-03',
    period: 'March 2026 (Live)',
    quarter: 'Q1-2026',
    mobilizer_name: 'Sunita Verma',
    mobilizer_id: 'mob-101',
    territory: 'Bengaluru South Cluster (Koramangala, BTM, HSR, E-City)',
    camps_conducted: 6,
    candidates_registered: 38,
    candidates_target: 45,
    intake_achievement_rate: 84.4,
    verified_kyc_count: 35,
    kyc_compliance_rate: 92.1,
    batch_inductions: 28,
    batch_transition_rate: 73.7,
    candidates_placed: 20,
    placement_conversion_rate: 88.0,
    avg_monthly_wage: 20600,
    estimated_mobilizer_incentive: 60000,
    status: 'ACTIVE_AUDIT',
    generated_date: '2026-03-14',
    lead_source_breakdown: {
      community_camps: 22,
      shg_women_networks: 10,
      referrals: 6
    },
    nf_breakdown: {
      nf1_job_ready: 14,
      nf2_upskilling: 16,
      nf3_foundational: 8
    },
    top_employers: [
      { name: 'Zomato Green Fleet', count: 8, avg_salary: 21500 },
      { name: 'BigBasket Electric', count: 6, avg_salary: 19800 },
      { name: 'Blinkit Logistics', count: 4, avg_salary: 18500 },
      { name: 'Uber Green Mobility', count: 2, avg_salary: 24000 }
    ],
    supervisor_assessment: 'Top 5% mobilizer efficiency in Bangalore zone. Rapid KYC turnaround and strong female driver intake ratio.'
  },
  {
    id: 'rep-2026-m02',
    report_title: 'February 2026 Final Mobilization & Placement Report',
    report_code: 'REP-MOB-2026-02',
    period: 'February 2026',
    quarter: 'Q1-2026',
    mobilizer_name: 'Sunita Verma',
    mobilizer_id: 'mob-101',
    territory: 'Bengaluru South Cluster',
    camps_conducted: 8,
    candidates_registered: 42,
    candidates_target: 40,
    intake_achievement_rate: 105.0,
    verified_kyc_count: 41,
    kyc_compliance_rate: 97.6,
    batch_inductions: 38,
    batch_transition_rate: 90.5,
    candidates_placed: 35,
    placement_conversion_rate: 92.1,
    avg_monthly_wage: 20400,
    estimated_mobilizer_incentive: 68500,
    status: 'AUDITED_AND_APPROVED',
    generated_date: '2026-03-01',
    lead_source_breakdown: {
      community_camps: 26,
      shg_women_networks: 12,
      referrals: 4
    },
    nf_breakdown: {
      nf1_job_ready: 15,
      nf2_upskilling: 19,
      nf3_foundational: 8
    },
    top_employers: [
      { name: 'Zomato Green Fleet', count: 14, avg_salary: 21500 },
      { name: 'BigBasket Electric', count: 12, avg_salary: 19800 },
      { name: 'Blinkit Logistics', count: 9, avg_salary: 18500 }
    ],
    supervisor_assessment: 'Exceeded target by 5%. Full compliance on learner DL renewals and bank account seeding.'
  },
  {
    id: 'rep-2026-m01',
    report_title: 'January 2026 Mobilization Induction Report',
    report_code: 'REP-MOB-2026-01',
    period: 'January 2026',
    quarter: 'Q1-2026',
    mobilizer_name: 'Sunita Verma',
    mobilizer_id: 'mob-101',
    territory: 'Bengaluru South Cluster',
    camps_conducted: 7,
    candidates_registered: 36,
    candidates_target: 35,
    intake_achievement_rate: 102.8,
    verified_kyc_count: 34,
    kyc_compliance_rate: 94.4,
    batch_inductions: 30,
    batch_transition_rate: 83.3,
    candidates_placed: 28,
    placement_conversion_rate: 93.3,
    avg_monthly_wage: 19800,
    estimated_mobilizer_incentive: 54000,
    status: 'AUDITED_AND_APPROVED',
    generated_date: '2026-02-01',
    lead_source_breakdown: {
      community_camps: 20,
      shg_women_networks: 11,
      referrals: 5
    },
    nf_breakdown: {
      nf1_job_ready: 12,
      nf2_upskilling: 16,
      nf3_foundational: 8
    },
    top_employers: [
      { name: 'Zomato Green Fleet', count: 12, avg_salary: 21000 },
      { name: 'BigBasket Electric', count: 10, avg_salary: 19500 },
      { name: 'Blinkit Logistics', count: 6, avg_salary: 18000 }
    ],
    supervisor_assessment: 'Strong Q1 start. Zero document rejection at verification portal.'
  }
];

export const getMobilizerReports = async (req, res) => {
  try {
    const { mobilizer_id, quarter, status } = req.query;

    let list = [...localMobilizerReports];

    if (mobilizer_id && mobilizer_id !== 'all') {
      list = list.filter(r => r.mobilizer_id === mobilizer_id || r.mobilizer_id === 'mob-101');
    }

    if (quarter && quarter !== 'ALL') {
      list = list.filter(r => r.quarter === quarter);
    }

    if (status && status !== 'ALL') {
      list = list.filter(r => r.status === status);
    }

    const totalReports = list.length;
    const totalMobilized = list.reduce((acc, r) => acc + r.candidates_registered, 0);
    const totalPlaced = list.reduce((acc, r) => acc + r.candidates_placed, 0);
    const overallPlacementRate = totalMobilized > 0 ? Math.round((totalPlaced / totalMobilized) * 100) : 0;
    const totalIncentivesEarned = list.reduce((acc, r) => acc + (r.estimated_mobilizer_incentive || 0), 0);

    return res.json({
      success: true,
      total: totalReports,
      stats: {
        total_reports: totalReports,
        total_mobilized_ytd: totalMobilized,
        total_placed_ytd: totalPlaced,
        overall_placement_rate: overallPlacementRate,
        total_incentives_earned: totalIncentivesEarned,
        avg_monthly_salary: 20266,
        retention_90_days: 94
      },
      data: list
    });
  } catch (error) {
    console.error('Error fetching mobilizer reports:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



