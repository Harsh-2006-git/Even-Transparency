import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';
import { formatDbError, validateContactFields } from '../utils/errorHandler.js';

export const getPartners = async (req, res) => {
  try {
    const { search, status, city } = req.query;

    const records = await db.Partner.findAll({
      order: [['created_at', 'DESC']]
    });

    let list = records.map(p => {
      const raw = p.toJSON();
      return {
        id: raw.id,
        name: raw.name,
        full_name: raw.name,
        code: raw.code || `PRT-${raw.id.substring(0, 4).toUpperCase()}`,
        employee_id: raw.code || `PRT-${raw.id.substring(0, 4).toUpperCase()}`,
        type: raw.type || 'NGO',
        partner_type: raw.type || 'NGO',
        contact_person: raw.contact_person || 'N/A',
        email: raw.email || '',
        phone: raw.phone || '',
        mobile_number: raw.phone || '',
        city: raw.city || 'Bengaluru',
        assigned_city: raw.city || 'Bengaluru',
        state: raw.state || 'Karnataka',
        assigned_state: raw.state || 'Karnataka',
        address: raw.address || '',
        status: raw.status || 'active',
        created_at: raw.created_at,
        updated_at: raw.updated_at
      };
    });

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.contact_person?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'all') {
      list = list.filter(p => p.status?.toLowerCase() === status.toLowerCase());
    }

    if (city && city !== 'all') {
      list = list.filter(p => p.city?.toLowerCase() === city.toLowerCase());
    }

    return res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    console.error('Error in getPartners:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createPartner = async (req, res) => {
  try {
    const {
      name,
      full_name,
      code,
      type,
      partner_type,
      contact_person,
      email,
      phone,
      mobile_number,
      city,
      assigned_city,
      state,
      assigned_state,
      address,
      status = 'active'
    } = req.body;

    const partnerName = name || full_name;
    const validation = validateContactFields({ email, phone: phone || mobile_number, name: partnerName });
    if (validation) {
      return res.status(400).json({ success: false, field: validation.field, message: validation.message });
    }

    const org = await db.Organization.findOne();

    const partner = await db.Partner.create({
      id: uuidv4(),
      organization_id: org?.id,
      name: partnerName.trim(),
      code: code || `PRT-${Math.floor(100 + Math.random() * 900)}`,
      type: type || partner_type || 'NGO',
      contact_person: contact_person || '',
      email: email ? email.trim().toLowerCase() : '',
      phone: phone || mobile_number || '',
      city: city || assigned_city || 'Bengaluru',
      state: state || assigned_state || 'Karnataka',
      address: address || '',
      status: status || 'active'
    });

    return res.status(201).json({
      success: true,
      message: 'Partner organization registered successfully in database',
      data: partner
    });
  } catch (error) {
    console.error('Error creating partner:', error);
    const formatted = formatDbError(error);
    return res.status(formatted.status).json({ success: false, field: formatted.field, message: formatted.message });
  }
};

export const updatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await db.Partner.findByPk(id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }

    const {
      name,
      full_name,
      code,
      type,
      partner_type,
      contact_person,
      email,
      phone,
      mobile_number,
      city,
      assigned_city,
      state,
      assigned_state,
      address,
      status
    } = req.body;

    if (name || full_name) partner.name = name || full_name;
    if (code) partner.code = code;
    if (type || partner_type) partner.type = type || partner_type;
    if (contact_person !== undefined) partner.contact_person = contact_person;
    if (email !== undefined) partner.email = email;
    if (phone || mobile_number) partner.phone = phone || mobile_number;
    if (city || assigned_city) partner.city = city || assigned_city;
    if (state || assigned_state) partner.state = state || assigned_state;
    if (address !== undefined) partner.address = address;
    if (status) partner.status = status;

    await partner.save();

    return res.json({ success: true, message: 'Partner updated successfully in database', data: partner });
  } catch (error) {
    console.error('Error updating partner:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await db.Partner.findByPk(id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }

    await partner.destroy();
    return res.json({ success: true, message: 'Partner removed from database' });
  } catch (error) {
    console.error('Error deleting partner:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
