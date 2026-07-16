import dns from 'dns/promises';
import net from 'net';

const hostname = 'ep-aged-flower-apd07crk-pooler.c-7.us-east-1.aws.neon.tech';
const port = 5432;

async function run() {
  let ipv4 = null;
  let ipv6 = null;

  console.log('--- Testing DNS Resolution Speed ---');

  try {
    const start = Date.now();
    const resolver = new dns.Resolver();
    resolver.setServers(['8.8.8.8', '1.1.1.1']);
    const ips = await resolver.resolve4(hostname);
    ipv4 = ips[0];
    console.log(`Custom Resolver resolve4 (IPv4) success: ${ips.join(', ')} in ${Date.now() - start} ms`);
  } catch (err) {
    console.error('Custom Resolver resolve4 failed:', err.message);
  }

  try {
    const start = Date.now();
    const lookupRes = await dns.lookup(hostname, { family: 6 });
    ipv6 = lookupRes.address;
    console.log(`dns.lookup success (IPv6): ${ipv6} in ${Date.now() - start} ms`);
  } catch (err) {
    console.error('dns.lookup failed:', err.message);
  }

  console.log('\n--- Testing TCP Connection Speed ---');

  if (ipv4) {
    try {
      const start = Date.now();
      await new Promise((resolve, reject) => {
        const socket = net.createConnection({ host: ipv4, port: port }, () => {
          console.log(`TCP connection to IPv4 (${ipv4}:${port}) success in ${Date.now() - start} ms`);
          socket.end();
          resolve();
        });
        socket.on('error', (err) => {
          reject(err);
        });
        socket.setTimeout(5000, () => {
          socket.destroy();
          reject(new Error('Timeout after 5s'));
        });
      });
    } catch (err) {
      console.error(`TCP connection to IPv4 (${ipv4}) failed:`, err.message);
    }
  }

  if (ipv6) {
    try {
      const start = Date.now();
      await new Promise((resolve, reject) => {
        const socket = net.createConnection({ host: ipv6, port: port }, () => {
          console.log(`TCP connection to IPv6 (${ipv6}:${port}) success in ${Date.now() - start} ms`);
          socket.end();
          resolve();
        });
        socket.on('error', (err) => {
          reject(err);
        });
        socket.setTimeout(5000, () => {
          socket.destroy();
          reject(new Error('Timeout after 5s'));
        });
      });
    } catch (err) {
      console.error(`TCP connection to IPv6 (${ipv6}) failed:`, err.message);
    }
  }

  try {
    const start = Date.now();
    await new Promise((resolve, reject) => {
      const socket = net.createConnection({ host: hostname, port: port }, () => {
        console.log(`TCP connection to Hostname (${hostname}:${port}) success in ${Date.now() - start} ms`);
        socket.end();
        resolve();
      });
      socket.on('error', (err) => {
        reject(err);
      });
      socket.setTimeout(5000, () => {
        socket.destroy();
        reject(new Error('Timeout after 5s'));
      });
    });
  } catch (err) {
    console.error(`TCP connection to Hostname (${hostname}) failed:`, err.message);
  }
}

run();
