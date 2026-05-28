import db from '../../models/index.js';
import { recalculateProfileCompletion } from '../../utils/profileCompletion.js';
import { createAuditLog } from '../../services/auditService.js';
import { notifyCandidate } from '../../services/notificationService.js';
import { prepareUpload } from '../../services/storageService.js';

export const requestDocumentUpload = async (req, res) => {
  try {
    const { document_type, file_name, file_size, mime_type } = req.body;
    if (!document_type || !file_name) {
      return res.status(400).json({ error: 'Document type and file name are required.' });
    }

    const upload = prepareUpload({
      ownerType: 'candidate',
      ownerId: req.candidate.id,
      fileName: file_name
    });

    return res.status(200).json({
      message: 'Document upload prepared.',
      document: {
        document_type,
        file_name,
        file_size,
        mime_type,
        file_url: upload.fileUrl,
        storage_key: upload.storageKey
      }
    });
  } catch (error) {
    console.error('Request document upload error:', error);
    return res.status(500).json({ error: 'Failed to prepare document upload.' });
  }
};

export const confirmDocumentUpload = async (req, res) => {
  try {
    const {
      document_type,
      file_name,
      file_url,
      file_size,
      mime_type,
      expiry_date
    } = req.body;

    if (!document_type || !file_name || !file_url) {
      return res.status(400).json({ error: 'Document type, file name and file URL are required.' });
    }

    const document = await db.CandidateDocument.create({
      candidate_id: req.candidate.id,
      document_type,
      file_name,
      file_url,
      file_size,
      mime_type,
      ocr_status: ['Aadhaar Card', 'PAN Card', 'Bank Passbook'].includes(document_type) ? 'pending' : 'skipped',
      verification_status: 'pending',
      expiry_date: expiry_date || null,
      uploaded_at: new Date()
    });

    await recalculateProfileCompletion(req.candidate);
    await createAuditLog({
      actorType: 'candidate',
      actorId: req.candidate.id,
      moduleName: 'candidate_documents',
      entityType: 'CandidateDocument',
      entityId: document.id,
      actionType: 'document_uploaded',
      newValues: document.toJSON(),
      req
    });
    await notifyCandidate({
      candidateId: req.candidate.id,
      title: 'Document uploaded',
      message: `${document_type} was submitted for verification.`
    });

    return res.status(201).json({
      message: 'Document uploaded successfully.',
      document
    });
  } catch (error) {
    console.error('Confirm document upload error:', error);
    return res.status(500).json({ error: 'Failed to save document.' });
  }
};

export const listCandidateDocuments = async (req, res) => {
  try {
    const documents = await db.CandidateDocument.findAll({
      where: { candidate_id: req.candidate.id },
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json(documents);
  } catch (error) {
    console.error('List candidate documents error:', error);
    return res.status(500).json({ error: 'Failed to fetch documents.' });
  }
};
