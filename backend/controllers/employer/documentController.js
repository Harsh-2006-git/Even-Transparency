import db from '../../models/index.js';
import { notifyEmployer, notifyAdmin } from '../../services/notificationService.js';
import { createAuditLog } from '../../services/auditService.js';
import { fileExists, generateUploadUrl, generateViewUrl, cloudinaryUrls, deleteFile } from '../../services/storageService.js';

export const requestDocumentUpload = async (req, res) => {
  try {
    const { document_type, file_name, file_size, mime_type } = req.body;
    if (!document_type || !file_name) {
      return res.status(400).json({ error: 'Document type and file name are required.' });
    }

    const employerId = req.user?.Employer?.id;
    if (!employerId) {
      return res.status(400).json({ error: 'Employer record not found for this user.' });
    }

    const upload = await generateUploadUrl({
      candidateId: employerId,
      documentType: document_type,
      mimeType: mime_type,
      fileSize: Number(file_size || 0)
    });

    return res.status(200).json({
      message: 'Upload URL generated. You have 5 minutes to complete the upload.',
      upload: {
        ...upload,
        fileName: file_name,
        documentType: document_type
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
      s3_key,
      file_size,
      mime_type,
      expiry_date
    } = req.body;

    if (!document_type || !file_name || !file_url) {
      return res.status(400).json({ error: 'Document type, file name and file URL are required.' });
    }

    const employerId = req.user?.Employer?.id;
    if (!employerId) {
      return res.status(400).json({ error: 'Employer record not found for this user.' });
    }

    let finalFileUrl = file_url;
    const isCloudinary = s3_key && cloudinaryUrls.has(s3_key);
    
    if (isCloudinary) {
      finalFileUrl = cloudinaryUrls.get(s3_key);
      cloudinaryUrls.delete(s3_key);
    } else if (s3_key) {
      const exists = await fileExists(s3_key);
      if (!exists) {
        return res.status(400).json({ error: 'Upload not detected in Cloudinary. Please upload the file before confirming.' });
      }
      finalFileUrl = await generateViewUrl(s3_key);
    }

    // Check if a document of this type already exists for the employer to replace it
    let document = await db.EmployerDocument.findOne({
      where: {
        employer_id: employerId,
        document_type
      }
    });

    if (document) {
      // Delete old file from Cloudinary/storage if it exists
      if (document.file_url) {
        try {
          await deleteFile(document.file_url);
        } catch (delError) {
          console.error('Failed to delete old document file:', delError);
        }
      }

      // Update existing record
      await document.update({
        file_name,
        file_url: finalFileUrl,
        file_size,
        mime_type,
        verification_status: 'approved',
        verified_at: new Date(),
        expiry_date: expiry_date || null,
        uploaded_at: new Date()
      });
    } else {
      // Create new record
      document = await db.EmployerDocument.create({
        employer_id: employerId,
        document_type,
        file_name,
        file_url: finalFileUrl,
        file_size,
        mime_type,
        verification_status: 'approved',
        verified_at: new Date(),
        expiry_date: expiry_date || null,
        uploaded_at: new Date()
      });
    }

    await createAuditLog({
      actorType: 'employer',
      actorId: req.user.id,
      moduleName: 'employer_documents',
      entityType: 'EmployerDocument',
      entityId: document.id,
      actionType: 'document_uploaded',
      newValues: document.toJSON(),
      req
    });

    // Notify employer and admin
    notifyEmployer({
      employerId,
      type: 'document_upload',
      title: 'Document Uploaded 📄',
      message: `Your ${document_type} has been uploaded and verified.`,
      entityType: 'EmployerDocument',
      entityId: document.id
    });
    notifyAdmin({
      type: 'document_upload',
      title: 'Employer Document Uploaded',
      message: `An employer uploaded their ${document_type}. Review required.`,
      entityType: 'EmployerDocument',
      entityId: document.id
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

export const listEmployerDocuments = async (req, res) => {
  try {
    const employerId = req.user?.Employer?.id;
    if (!employerId) {
      return res.status(400).json({ error: 'Employer record not found for this user.' });
    }

    const documents = await db.EmployerDocument.findAll({
      where: { employer_id: employerId },
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json(documents);
  } catch (error) {
    console.error('List employer documents error:', error);
    return res.status(500).json({ error: 'Failed to fetch documents.' });
  }
};

export const getEmployerDocumentViewUrl = async (req, res) => {
  try {
    const employerId = req.user?.Employer?.id;
    if (!employerId) {
      return res.status(400).json({ error: 'Employer record not found for this user.' });
    }

    const document = await db.EmployerDocument.findOne({
      where: {
        id: req.params.id,
        employer_id: employerId
      }
    });

    if (!document) return res.status(404).json({ error: 'Document not found.' });

    // If the file is on Cloudinary, return it directly
    if (document.file_url && !document.file_url.includes('.amazonaws.com/')) {
      return res.status(200).json({ viewUrl: document.file_url, expiresInSeconds: 900 });
    }

    const key = document.file_url?.split('.amazonaws.com/')[1];
    if (!key) return res.status(400).json({ error: 'Document is not backed by an S3 object.' });

    const viewUrl = await generateViewUrl(key);
    return res.status(200).json({ viewUrl, expiresInSeconds: 900 });
  } catch (error) {
    console.error('Get document view URL error:', error);
    return res.status(500).json({ error: 'Failed to generate document view URL.' });
  }
};
