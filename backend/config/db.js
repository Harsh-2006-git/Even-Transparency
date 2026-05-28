import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import net from 'net';
import dns from 'dns/promises';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is not defined.');
}

const dnsCache = {};

class CustomSocket extends net.Socket {
  connect(port, host, connectionListener) {
    const customLookup = (hostname, options, callback) => {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }

      // Bypass DNS lookups for local endpoints
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return callback(null, hostname, 4);
      }

      // Return cached DNS lookup immediately if available
      if (dnsCache[hostname]) {
        const ips = dnsCache[hostname];
        if (options.all) {
          return callback(null, ips.map(ip => ({ address: ip, family: 4 })));
        } else {
          return callback(null, ips[0], 4);
        }
      }

      const r = new dns.Resolver();
      r.setServers(['8.8.8.8', '1.1.1.1']);
      r.resolve4(hostname)
        .then(ips => {
          if (ips && ips.length > 0) {
            dnsCache[hostname] = ips; // Cache the resolved IPs
          }
          if (options.all) {
            callback(null, ips.map(ip => ({ address: ip, family: 4 })));
          } else {
            callback(null, ips[0], 4);
          }
        })
        .catch(err => {
          callback(err);
        });
    };

    if (typeof port === 'object') {
      return super.connect({ lookup: customLookup, ...port }, host || connectionListener);
    } else if (typeof host === 'string') {
      return super.connect({ port, host, lookup: customLookup }, connectionListener);
    } else {
      return super.connect(port, host, connectionListener);
    }
  }
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false, // Turn on console.log if you want to see detailed SQL queries in the logs
  dialectOptions: {
    // Enable SSL if connecting to a non-local database (e.g. Supabase, Render, Heroku)
    ssl: databaseUrl && !databaseUrl.includes('localhost') && !databaseUrl.includes('127.0.0.1')
      ? { rejectUnauthorized: false }
      : false,
    // Custom socket stream to override DNS lookup for resolving Neon DB hostname
    ...(databaseUrl && !databaseUrl.includes('localhost') && !databaseUrl.includes('127.0.0.1')
      ? { stream: () => new CustomSocket() }
      : {})
  }
});

/**
 * Health check helper to verify connection to PostgreSQL via Sequelize
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
