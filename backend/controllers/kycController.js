import db from '../models/index.js';

// 1. GET /api/kyc/queue - Combined KYC Verification Queue
export const getKYCQueue = async (req, res) => {
  try {
    const { status = 'all' } = req.query;

    // Fetch candidate documents with candidate details
    const docQuery = {
      include: [
        {
          model: db.Candidate,
          as: 'candidate',
          attributes: ['id', 'candidate_code', 'full_name', 'mobile_number', 'city', 'state', 'current_stage', 'nf_category']
        }
      ],
      order: [['created_at', 'DESC']]
    };

    if (status !== 'all') {
      docQuery.where = { verification_status: status.toUpperCase() };
    }

    const docRecords = await db.CandidateDocument.findAll(docQuery);

    const formattedDocs = docRecords.map(d => {
      const raw = d.toJSON();
      const cand = raw.candidate || {};
      return {
        id: raw.id,
        record_type: 'candidate_document',
        entity_name: cand.full_name || 'Candidate',
        entity_code: cand.candidate_code || 'ET-2026',
        candidate_id: raw.candidate_id,
        phone_number: cand.mobile_number || '',
        city: cand.city || 'Bengaluru',
        state: cand.state || 'Karnataka',
        stage: cand.current_stage || 'MOBILIZED',
        nf_category: cand.nf_category || 'NF1',
        document_type: raw.document_type || 'Aadhaar Card',
        document_number: raw.document_number || 'DOC-PENDING',
        file_name: raw.file_name || `${raw.document_type || 'document'}.pdf`,
        file_url: raw.file_url || raw.document_url || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
        verification_status: (raw.verification_status || 'PENDING').toUpperCase(),
        notes: raw.notes || '',
        created_at: raw.created_at,
        verified_at: raw.verified_at
      };
    });

    // Also fetch pending staff / user accounts
    const userQuery = {
      where: {
        status: 'inactive'
      },
      order: [['created_at', 'DESC']]
    };

    const pendingUsers = await db.User.findAll(userQuery);
    const formattedUsers = pendingUsers.map(u => {
      const raw = u.toJSON();
      const perms = raw.permissions || {};
      return {
        id: raw.id,
        record_type: 'user_account',
        entity_name: raw.full_name || 'Staff User',
        entity_code: raw.employee_id || 'USR-PEND',
        candidate_id: null,
        phone_number: raw.mobile_number || '',
        city: 'Bengaluru',
        state: 'Karnataka',
        stage: raw.role || 'Staff',
        nf_category: 'N/A',
        document_type: perms.kyc_document_type || 'Aadhaar + Staff Credential',
        document_number: raw.employee_id || 'EMP-ID',
        file_name: 'staff_identity_credential.pdf',
        file_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
        verification_status: 'PENDING',
        notes: 'Awaiting admin credential verification.',
        created_at: raw.created_at,
        verified_at: null
      };
    });

    const combined = [...formattedDocs, ...formattedUsers];

    const total = combined.length;
    const pending = combined.filter(c => c.verification_status === 'PENDING').length;
    const verified = combined.filter(c => c.verification_status === 'VERIFIED').length;
    const rejected = combined.filter(c => c.verification_status === 'REJECTED').length;

    return res.json({
      success: true,
      stats: {
        total,
        pending,
        verified,
        rejected,
        compliance_rate: total > 0 ? Math.round((verified / total) * 100) : 100
      },
      data: combined
    });
  } catch (error) {
    console.error('Error fetching KYC queue:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. PATCH /api/kyc/verify-document/:id - Verify or Reject Candidate Document
export const verifyCandidateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'VERIFIED', notes, rejection_reason, verified_by = 'Super Administrator' } = req.body;

    const doc = await db.CandidateDocument.findByPk(id, {
      include: [{ model: db.Candidate, as: 'candidate' }]
    });

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    doc.verification_status = status.toUpperCase();
    doc.notes = notes || (status === 'VERIFIED' ? 'Verified against official credentials.' : rejection_reason || 'Rejected by Admin.');
    doc.verified_at = new Date();
    if (rejection_reason) doc.rejection_reason = rejection_reason;
    await doc.save();

    // Check if candidate now has verified Aadhaar / essential documents
    if (doc.candidate_id && status === 'VERIFIED') {
      const candidate = await db.Candidate.findByPk(doc.candidate_id);
      if (candidate && candidate.current_stage === 'MOBILIZED') {
        candidate.current_stage = 'READINESS_ASSESSMENT';
        await candidate.save();
      }
    }

    return res.json({
      success: true,
      message: `Document status updated to ${status}!`,
      data: doc
    });
  } catch (error) {
    console.error('Error verifying document:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. PATCH /api/kyc/verify-user/:id - Verify User Account
export const verifyUserAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'active', remarks = 'Verified by Admin' } = req.body;

    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.status = status;
    user.permissions = {
      ...(user.permissions || {}),
      kyc_status: status === 'active' ? 'VERIFIED' : 'REJECTED',
      verified_at: new Date().toISOString(),
      remarks
    };
    await user.save();

    return res.json({
      success: true,
      message: `User ${user.full_name} verification completed: ${status}`,
      data: user
    });
  } catch (error) {
    console.error('Error verifying user:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
