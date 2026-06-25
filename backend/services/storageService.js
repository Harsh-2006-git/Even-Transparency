import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Pre-load environment variables for Cloudinary configuration in ES Modules
dotenv.config();

// Cloudinary URL map to cache successfully uploaded file URLs by key/publicId
export const cloudinaryUrls = new Map();

// Configure Cloudinary using environment credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const ALLOWED_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf'
};

const MAX_FILE_SIZES = {
  'Passport Photo': 2 * 1024 * 1024,
  default: 5 * 1024 * 1024
};

const validateFile = ({ documentType, mimeType, fileSize }) => {
  if (!ALLOWED_TYPES[mimeType]) {
    throw new Error(`File type ${mimeType} is not allowed. Use JPEG, PNG, WebP, or PDF.`);
  }

  const maxSize = MAX_FILE_SIZES[documentType] || MAX_FILE_SIZES.default;
  if (Number(fileSize || 0) > maxSize) {
    throw new Error(`File size exceeds the ${maxSize / (1024 * 1024)}MB limit for ${documentType}.`);
  }
};

const createS3Key = ({ candidateId, documentType, mimeType }) => {
  const ext = ALLOWED_TYPES[mimeType];
  const sanitizedType = String(documentType || 'document').toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `candidates/${candidateId}/documents/${sanitizedType}/${crypto.randomUUID()}.${ext}`;
};

export const generateUploadUrl = async ({ candidateId, documentType, mimeType, fileSize }) => {
  validateFile({ documentType, mimeType, fileSize });

  const s3Key = createS3Key({ candidateId, documentType, mimeType });
  
  // Point uploadUrl to the local express proxy endpoint which handles uploading to Cloudinary
  const port = process.env.PORT || 5000;
  const uploadUrl = `http://localhost:${port}/api/candidate/documents/upload-proxy?key=${encodeURIComponent(s3Key)}`;
  
  const resourceType = String(s3Key).endsWith('.pdf') ? 'raw' : 'image';
  const fileUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/${s3Key}`;

  return { uploadUrl, s3Key, fileUrl };
};

export const generateViewUrl = async (s3Key, expiresIn = 900) => {
  // If s3Key starts with http or https, it is already a direct Cloudinary URL
  if (String(s3Key).startsWith('http://') || String(s3Key).startsWith('https://')) {
    return s3Key;
  }
  const resourceType = String(s3Key).endsWith('.pdf') ? 'raw' : 'image';
  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/${s3Key}`;
};

export const deleteFile = async (s3Key) => {
  if (!s3Key) return;
  
  let key = s3Key;
  if (String(s3Key).startsWith('http://') || String(s3Key).startsWith('https://')) {
    const uploadIndex = s3Key.indexOf('/upload/');
    if (uploadIndex !== -1) {
      key = s3Key.substring(uploadIndex + 8);
      if (key.startsWith('v')) {
        const parts = key.split('/');
        if (parts[0].match(/^v\d+$/)) {
          parts.shift();
          key = parts.join('/');
        }
      }
    } else {
      return;
    }
  }

  const resourceType = String(key).endsWith('.pdf') ? 'raw' : 'image';
  const publicId = resourceType === 'image' 
    ? String(key).replace(/\.[^/.]+$/, "") 
    : key;

  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    console.log(`[Cloudinary Delete] Deleted asset ${publicId} of type ${resourceType}. Result:`, result);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};

export const fileExists = async (s3Key) => {
  if (!s3Key) return false;
  
  let key = s3Key;
  if (String(s3Key).startsWith('http://') || String(s3Key).startsWith('https://')) {
    const uploadIndex = s3Key.indexOf('/upload/');
    if (uploadIndex !== -1) {
      key = s3Key.substring(uploadIndex + 8);
      if (key.startsWith('v')) {
        const parts = key.split('/');
        if (parts[0].match(/^v\d+$/)) {
          parts.shift();
          key = parts.join('/');
        }
      }
    }
  }

  const resourceType = String(key).endsWith('.pdf') ? 'raw' : 'image';
  const publicId = resourceType === 'image' 
    ? String(key).replace(/\.[^/.]+$/, "") 
    : key;

  try {
    await cloudinary.api.resource(publicId, { resource_type: resourceType });
    return true;
  } catch (error) {
    return false;
  }
};

export const prepareUpload = async ({ ownerId, documentType, mimeType, fileSize }) => (
  generateUploadUrl({ candidateId: ownerId, documentType, mimeType, fileSize })
);
