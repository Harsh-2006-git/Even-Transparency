import db from '../../models/index.js';

export const getOnboardingDetails = async (req, res) => {
  try {
    const employer = await db.Employer.findByPk(req.user.employer_id, {
      include: [db.EmployerLocation, db.EmployerDocument]
    });

    if (!employer) {
      return res.status(404).json({ error: 'Employer details not found' });
    }

    return res.status(200).json({ employer });
  } catch (error) {
    console.error('getOnboardingDetails error:', error);
    return res.status(500).json({ error: 'Failed to retrieve onboarding details' });
  }
};

export const updateOnboardingDetails = async (req, res) => {
  try {
    const {
      company_name,
      legal_entity_name,
      company_type,
      industry_sector,
      cin_number,
      gst_number,
      pan_number,
      incorporation_date,
      company_size,
      website_url,
      official_email,
      official_phone_number,
      registered_address,
      headquarters_city,
      headquarters_state,
      headquarters_pincode,
      headquarters_country,
      naps_establishment_id,
      esic_registration_number,
      epfo_registration_number,
      posh_compliance,
      women_friendly_workplace
    } = req.body;

    const employer = await db.Employer.findByPk(req.user.employer_id);

    if (!employer) {
      return res.status(404).json({ error: 'Employer company not found' });
    }

    // Update Employer fields
    await employer.update({
      company_name: company_name || employer.company_name,
      legal_entity_name,
      company_type,
      industry_sector,
      cin_number,
      gst_number,
      pan_number,
      incorporation_date,
      company_size,
      website_url,
      official_email,
      official_phone_number,
      registered_address,
      headquarters_city,
      headquarters_state,
      headquarters_pincode,
      headquarters_country,
      naps_establishment_id,
      esic_registration_number,
      epfo_registration_number,
      posh_compliance,
      women_friendly_workplace,
      onboarding_status: 'completed',
      onboarding_completed_at: new Date()
    });

    return res.status(200).json({
      message: 'Onboarding details updated successfully',
      employer
    });
  } catch (error) {
    console.error('updateOnboardingDetails error:', error);
    return res.status(500).json({ error: 'Failed to update onboarding details' });
  }
};

export const getMyCompany = async (req, res) => {
  try {
    const employer = req.user?.Employer;
    if (!employer) {
      return res.status(404).json({ error: 'Company profile not found.' });
    }

    return res.status(200).json({ employer });
  } catch (error) {
    console.error('Get my company error:', error);
    return res.status(500).json({ error: 'Failed to fetch company profile.' });
  }
};

export const updateMyCompany = async (req, res) => {
  try {
    const employerUser = req.user;
    const employer = employerUser?.Employer;

    if (!employer) {
      return res.status(404).json({ error: 'Company profile not found.' });
    }

    const allowedFields = [
      'company_name',
      'legal_entity_name',
      'company_type',
      'industry_sector',
      'cin_number',
      'gst_number',
      'pan_number',
      'incorporation_date',
      'company_size',
      'website_url',
      'official_email',
      'official_phone_number',
      'registered_address',
      'headquarters_city',
      'headquarters_state',
      'headquarters_pincode',
      'headquarters_country',
      'naps_establishment_id',
      'esic_registration_number',
      'epfo_registration_number',
      'posh_compliance',
      'maternity_policy_available',
      'women_friendly_workplace',
      'gender_policy_status'
    ];

    const payload = {};
    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        payload[field] = req.body[field];
      }
    });

    await employer.update(payload);

    return res.status(200).json({
      message: 'Company profile updated successfully.',
      employer
    });
  } catch (error) {
    console.error('Update my company error:', error);
    return res.status(500).json({ error: 'Failed to update company profile.' });
  }
};
