import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import dns from 'dns';

// Force Node.js to resolve IPv4 addresses first to avoid ENOTFOUND issues on dual-stack hosts (e.g. Aiven Cloud)
dns.setDefaultResultOrder('ipv4first');

dotenv.config();

// ─── Suppress the noisy pg-connection-string SSL deprecation warning ──────────
// This warning fires because pg >= 8.x now treats sslmode=require as verify-full.
// We handle SSL exclusively via dialectOptions.ssl, so the warning is irrelevant.
const _originalEmit = process.emit.bind(process);
process.emit = function (event, ...args) {
  if (
    event === 'warning' &&
    args[0]?.message?.includes('SSL modes')
  ) {
    return false; // swallow the warning
  }
  return _originalEmit(event, ...args);
};

const sanitizeUrl = (str) => {
  if (!str) return str;
  let val = str.trim();
  while ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1).trim();
  }
  if (val.startsWith('"') || val.startsWith("'")) {
    val = val.replace(/^['"]|['"]$/g, '').trim();
  }
  return val;
};

const rawUrl = sanitizeUrl(process.env.DATABASE_URL);

if (!rawUrl) {
  console.error('❌  DATABASE_URL environment variable is not defined.');
}

// Strip all SSL-related query params from the URL so pg-connection-string
// cannot override our dialectOptions.ssl settings below.
// We control SSL entirely through Sequelize dialectOptions.
const databaseUrl = rawUrl
  ? rawUrl
      .replace(/[?&](sslmode|uselibpqcompat|channel_binding)=[^&]*/g, '')
      .replace(/\?&/, '?')   // fix ?& → ?
      .replace(/[?&]+$/, '') // trim trailing ? or &
  : rawUrl;

const isRemote =
  rawUrl &&
  !rawUrl.includes('localhost') &&
  !rawUrl.includes('127.0.0.1');

const sequelize = new Sequelize(databaseUrl || 'postgres://avnadmin:password@localhost:5432/defaultdb', {
  dialect: 'postgres',
  logging: false, // Set to console.log to debug raw SQL
  retry: {
    max: 3,
    match: [
      /SequelizeHostNotFoundError/,
      /ENOTFOUND/,
      /ECONNREFUSED/,
      /ETIMEDOUT/,
      /ConnectionError/
    ]
  },
  pool: {
    max: 8,        // Respect Aiven Cloud PostgreSQL maximum connection limits
    min: 2,        // Keep warm connections pre-established for fast query execution
    acquire: 30000,
    idle: 30000,   // Keep connections warm for 30 seconds before eviction
    evict: 5000    // Evict check interval
  },
  dialectOptions: {
    // rejectUnauthorized: false accepts Aiven's self-signed CA certificate.
    // SSL is enabled for all remote (non-localhost) connections.
    ssl: isRemote ? { rejectUnauthorized: false } : false,
    keepAlive: true // TCP keep-alive prevents idle connection drops on cloud DBs
  }
});

/**
 * Health check helper to verify connection to PostgreSQL via Sequelize.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    return {
      success: true,
      message: 'Successfully connected to PostgreSQL database via Sequelize.'
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to connect to database: ${error.message}`
    };
  }
};

export default sequelize;
