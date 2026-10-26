// Centralized API Base URL configuration
// In production, reads from environment variable API_BASE_URL or VITE_API_BASE_URL
// In development, falls back to local backend if not specified

export const API_BASE_URL = (
  import.meta.env.API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.API_BASE_URL || `${(import.meta.env.API_BASE_URL || 'http://localhost:5000/api').replace(/\/+$/, '')}`).replace(/\/+$/, '')
).replace(/\/+$/, '');

export default API_BASE_URL;
