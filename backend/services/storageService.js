import crypto from 'crypto';

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

const getAwsClients = async () => {
  if (!process.env.AWS_S3_BUCKET) {
    throw new Error('AWS_S3_BUCKET is not configured.');
  }

  const s3 = await import('@aws-sdk/client-s3');
  const presigner = await import('@aws-sdk/s3-request-presigner');
  const s3Client = new s3.S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
      : undefined
  });

  return { ...s3, ...presigner, s3Client };
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
  const bucket = process.env.AWS_S3_BUCKET;

  try {
    const { PutObjectCommand, getSignedUrl, s3Client } = await getAwsClients();
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: s3Key,
      ContentType: mimeType,
      ContentLength: Number(fileSize || 0),
      Metadata: {
        candidateId: String(candidateId),
        documentType,
        uploadedAt: new Date().toISOString()
      }
    });
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    const fileUrl = `https://${bucket}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${s3Key}`;
    return { uploadUrl, s3Key, fileUrl };
  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      throw new Error('AWS SDK packages are not installed. Install @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner.');
    }
    throw error;
  }
};

export const generateViewUrl = async (s3Key, expiresIn = 900) => {
  try {
    const { GetObjectCommand, getSignedUrl, s3Client } = await getAwsClients();
    return getSignedUrl(s3Client, new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: s3Key
    }), { expiresIn });
  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      throw new Error('AWS SDK packages are not installed. Install @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner.');
    }
    throw error;
  }
};

export const deleteFile = async (s3Key) => {
  const { DeleteObjectCommand, s3Client } = await getAwsClients();
  await s3Client.send(new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: s3Key
  }));
};

export const fileExists = async (s3Key) => {
  try {
    const { HeadObjectCommand, s3Client } = await getAwsClients();
    await s3Client.send(new HeadObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: s3Key
    }));
    return true;
  } catch {
    return false;
  }
};

export const prepareUpload = async ({ ownerId, documentType, mimeType, fileSize }) => (
  generateUploadUrl({ candidateId: ownerId, documentType, mimeType, fileSize })
);
