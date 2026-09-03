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
