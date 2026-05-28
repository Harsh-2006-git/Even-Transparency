import crypto from 'crypto';
import path from 'path';

const PUBLIC_UPLOAD_BASE = process.env.PUBLIC_UPLOAD_BASE_URL || '/uploads';

export const createStorageKey = ({ ownerType, ownerId, fileName }) => {
  const ext = path.extname(fileName || '').toLowerCase();
  const safeExt = ext && ext.length <= 12 ? ext : '';
  return `${ownerType}/${ownerId}/${Date.now()}-${crypto.randomUUID()}${safeExt}`;
};

export const createFileUrl = (storageKey) => `${PUBLIC_UPLOAD_BASE}/${storageKey.replaceAll('\\', '/')}`;

export const prepareUpload = ({ ownerType, ownerId, fileName }) => {
  const storageKey = createStorageKey({ ownerType, ownerId, fileName });
  return {
    storageKey,
    fileUrl: createFileUrl(storageKey),
    uploadMode: 'metadata',
    message: 'Store the file with this key in your configured storage, then confirm the upload.'
  };
};
