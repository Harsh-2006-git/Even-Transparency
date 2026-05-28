import express from 'express';
import http from 'http';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import crypto from 'crypto';
import sequelize, { testConnection } from './config/db.js';
import { Op } from 'sequelize';
import employerRoutes from './routes/employerRoutes.js';
import authRoutes from './routes/authRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import './models/index.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Enable CORS for frontend connectivity
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://even-cargo-hire.vercel.app',
    'https://even-cargo-hire.vercel.app/'
  ],
  credentials: true
}));

// Enable gzip compression for all responses
app.use(compression());

app.use(express.json());

// 1. Health Check Endpoint
app.get('/api/health', async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    status: 'ok',
    serverTime: new Date(),
    database: dbStatus
  });
});

app.use('/api', authRoutes);
app.use('/api', employerRoutes);
app.use('/api', candidateRoutes);
app.use('/api', notificationRoutes);

// Synchronize database models and start listening
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.sync();
    console.log('All models synced successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server / sync database:', error);
  }
};

startServer();
