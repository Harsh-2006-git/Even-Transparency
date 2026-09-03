import express from 'express';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// POST /api/upload - Upload file/base64 to Cloudinary
router.post('/', async (req, res) => {
  try {
    const { file, fileName, documentType, folder = 'even_transparency/candidate_docs' } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file data provided. Please provide a base64 encoded file string.'
      });
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true,
      tags: ['candidate_document', documentType || 'kyc_proof']
    });

    return res.status(200).json({
      success: true,
      message: 'Document uploaded to Cloudinary successfully',
      data: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
        original_filename: fileName || uploadResult.original_filename,
        created_at: uploadResult.created_at
      }
    });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload document to Cloudinary'
    });
  }
});

// DELETE /api/upload/:public_id - Remove file from Cloudinary
router.delete('/:public_id', async (req, res) => {
  try {
    const { public_id } = req.params;
    const result = await cloudinary.uploader.destroy(public_id);
    return res.status(200).json({
      success: true,
      message: 'Document deleted from Cloudinary',
      result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete document from Cloudinary'
    });
  }
});

export default router;
