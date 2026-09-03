import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize, { testConnection } from './config/db.js';
import db from './models/index.js';
import mobilizerRoutes from './routes/mobilizerRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'Even Transparency Candidate Lifecycle Portal API',
    timestamp: new Date().toISOString(),
    modelsCount: Object.keys(db).filter(k => k !== 'sequelize' && k !== 'Sequelize').length,
  });
});

// Authentication API
app.use('/api/auth', authRoutes);

// User Management & Verification API
app.use('/api/users', userRoutes);

// Document & KYC Upload API (Cloudinary)
app.use('/api/upload', uploadRoutes);

// Master Data Helper Routes
app.get('/api/master/organizations', async (req, res) => {
  try {
    const orgs = [
      { id: 'org-1', name: 'Even Mobility Foundation', type: 'NGO' },
      { id: 'org-2', name: 'Gujarat Livelihood Mission', type: 'Government' },
      { id: 'org-3', name: 'Delhi Skill Development Society', type: 'Training Partner' },
      { id: 'org-4', name: 'Karnataka Women Empowerment Corp', type: 'Government' }
    ];
    res.json({ success: true, data: orgs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/master/partners', async (req, res) => {
  try {
    const partners = [
      { id: 'prt-1', name: 'Mahila Vikas Samiti (NGO)', city: 'Bengaluru' },
      { id: 'prt-2', name: 'Delhi Skill Development Society', city: 'Delhi' },
      { id: 'prt-3', name: 'Sakhi Self Help Federation', city: 'Ahmedabad' },
      { id: 'prt-4', name: 'Prerna Gramin Samiti', city: 'Lucknow' }
    ];
    res.json({ success: true, data: partners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mobilizer Management API
app.use('/api/mobilizers', mobilizerRoutes);

// Candidate Onboarding & Management API
app.use('/api/candidates', candidateRoutes);

// Start Server & Authenticate DB
async function startServer() {
  try {
    const conn = await testConnection();
    if (conn.success) {
      console.log('✅ PostgreSQL Database connected successfully.');
      try {
        await sequelize.sync({ alter: true });
        console.log('✅ Sequelize models synchronized with database schema.');
      } catch (syncErr) {
        console.warn('⚠️  Database schema sync notice:', syncErr.message);
      }
    } else {
      console.warn('⚠️  Database connection notice:', conn.message);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Even Transparency Backend running on port ${PORT}`);
      console.log(`📡 Healthcheck available at http://localhost:${PORT}/api/health`);
      console.log(`👥 Mobilizer API available at http://localhost:${PORT}/api/mobilizers`);
    });
  } catch (error) {
    console.error('❌ Failed to start backend server:', error);
  }
}

startServer();

export default app;
