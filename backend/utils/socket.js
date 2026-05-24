/**
 * socket.js – Singleton Socket.io instance
 *
 * Initialised once in index.js via initSocket(httpServer).
 * Controllers call getIO() to emit events without touching the http server directly.
 */
import { Server } from 'socket.io';

const CORS_ORIGINS = [
  'http://localhost:5173',
  'https://even-cargo-hire.vercel.app',
  'https://even-cargo-hire.vercel.app/'
];

let _io = null;

export const initSocket = (httpServer) => {
  _io = new Server(httpServer, {
    cors: {
      origin: CORS_ORIGINS,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  _io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  console.log('[Socket.io] Server initialised.');
  return _io;
};

export const getIO = () => {
  if (!_io) {
    console.warn('[Socket.io] Not yet initialised. Skipping emit.');
    return null;
  }
  return _io;
};
