const { S3Client, DeleteObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET;

// Allowed MIME types and their extensions
const ALLOWED_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};

// Max file sizes per document type (in bytes)
const MAX_FILE_SIZES = {
  'Passport Photo': 2 * 1024 * 1024,       // 2 MB
  'default': 5 * 1024 * 1024,              // 5 MB for all others
};

/**
 * Generate a pre-signed PUT URL so the frontend uploads directly to S3
 * Claude generates this; the developer must ensure the S3 bucket has
 * the correct CORS policy allowing PUT from the frontend origin.
 *
 * @param {Object} params
 * @param {string} params.candidateId
 * @param {string} params.documentType
 * @param {string} params.mimeType
 * @param {number} params.fileSize
 * @returns {{ uploadUrl: string, s3Key: string, fileUrl: string }}
 */
const generateUploadUrl = async ({ candidateId, documentType, mimeType, fileSize }) => {
  // Validate mime type
  if (!ALLOWED_TYPES[mimeType]) {
    throw new Error(`File type ${mimeType} is not allowed. Use JPEG, PNG, WebP, or PDF.`);
  }

  // Validate file size
  const maxSize = MAX_FILE_SIZES[documentType] || MAX_FILE_SIZES['default'];
  if (fileSize > maxSize) {
    const maxMB = maxSize / (1024 * 1024);
    throw new Error(`File size exceeds the ${maxMB}MB limit for ${documentType}.`);
  }

  const ext = ALLOWED_TYPES[mimeType];
  const uniqueId = uuidv4();
  const sanitizedType = documentType.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const s3Key = `candidates/${candidateId}/documents/${sanitizedType}/${uniqueId}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: s3Key,
    ContentType: mimeType,
    ContentLength: fileSize,
    Metadata: {
      candidateId: String(candidateId),
      documentType,
      uploadedAt: new Date().toISOString(),
    },
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 300, // 5 minutes to complete the upload
  });

  // Permanent access URL — accessed via signed GET, not public
  const fileUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

  return { uploadUrl, s3Key, fileUrl };
};

/**
 * Generate a short-lived signed GET URL for secure document viewing
 * @param {string} s3Key
 * @param {number} expiresIn - seconds (default 15 minutes)
 * @returns {string} signed URL
 */
const generateViewUrl = async (s3Key, expiresIn = 900) => {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: s3Key });
  return getSignedUrl(s3Client, command, { expiresIn });
};

/**
 * Delete a document from S3
 * @param {string} s3Key
 */
const deleteFile = async (s3Key) => {
  try {
    await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: s3Key }));
    logger.info(`Deleted S3 object: ${s3Key}`);
  } catch (error) {
    logger.error(`S3 delete failed for ${s3Key}: ${error.message}`);
    throw error;
  }
};

/**
 * Check if a file actually exists in S3 (post-upload confirmation)
 * @param {string} s3Key
 * @returns {boolean}
 */
const fileExists = async (s3Key) => {
  try {
    await s3Client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: s3Key }));
    return true;
  } catch {
    return false;
  }
};

module.exports = { generateUploadUrl, generateViewUrl, deleteFile, fileExists };
