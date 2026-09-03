import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dy6hcbcuz',
  api_key: process.env.CLOUDINARY_API_KEY || '531833184556158',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'POJpWai9uzdO8866bxeZX2FcU3s',
  secure: true
});

export default cloudinary;
