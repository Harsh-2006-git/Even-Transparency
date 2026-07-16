import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import net from 'net';
import dns from 'dns/promises';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
console.log('Database URL:', databaseUrl ? 'Defined' : 'NOT Defined');

const dnsCache = {};

class CustomSocket extends net.Socket {
  connect(port, host, connectionListener) {
    const customLookup = (hostname, options, callback) => {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return callback(null, hostname, 4);
      }
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
            dnsCache[hostname] = ips;
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

async function testWithCustomSocket() {
  console.log('\n--- Testing WITH CustomSocket ---');
  const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
      stream: () => new CustomSocket()
    }
  });

  try {
    const start1 = Date.now();
    await sequelize.authenticate();
    console.log(`First connection success! Time taken: ${Date.now() - start1} ms`);

    const start2 = Date.now();
    await sequelize.query('SELECT 1+1 AS result');
    console.log(`Subsequent query success! Time taken: ${Date.now() - start2} ms`);

    await sequelize.close();
  } catch (error) {
    console.error('Failed with CustomSocket:', error.message);
  }
}

async function testWithoutCustomSocket() {
  console.log('\n--- Testing WITHOUT CustomSocket (Standard DNS & PG socket) ---');
  const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: { rejectUnauthorized: false }
    }
  });

  try {
    const start1 = Date.now();
    await sequelize.authenticate();
    console.log(`First connection success! Time taken: ${Date.now() - start1} ms`);

    const start2 = Date.now();
    await sequelize.query('SELECT 1+1 AS result');
    console.log(`Subsequent query success! Time taken: ${Date.now() - start2} ms`);

    await sequelize.close();
  } catch (error) {
    console.error('Failed without CustomSocket:', error.message);
  }
}

async function run() {
  await testWithCustomSocket();
  await testWithoutCustomSocket();
}

run();
