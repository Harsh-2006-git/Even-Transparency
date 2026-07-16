import net from 'net';

const client = new net.Socket();
client.setTimeout(2000);

client.connect(5000, '127.0.0.1', () => {
  console.log('Successfully connected to Port 5000 on localhost!');
  client.end();
});

client.on('error', (err) => {
  console.error('Connection to port 5000 failed:', err.message);
});

client.on('timeout', () => {
  console.error('Connection to port 5000 timed out.');
  client.destroy();
});
