import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import sequelize, { testConnection } from './config/db.js';
import { Op } from 'sequelize';
import User from './models/User.js';
import Candidate from './models/Candidate.js';
import Question from './models/Question.js';
import authRoutes from './routes/authRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import { seedQuestions } from './seeders/questionSeeder.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend connectivity
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

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

// 2. Mount Modular Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/questions', questionRoutes);

// Seeding helper to create initial administrator
const seedDefaultAdmin = async () => {
  try {
    const userCount = await User.count();
    if (userCount === 0) {
      const adminPassword = crypto.createHash('sha256').update('adminpassword').digest('hex');
      await User.create({
        username: 'Even Cargo',
        email: 'admin@evencargo.in',
        password: adminPassword,
        phone: '+91 99999 99999',
        userType: 'Admin'
      });
    }
  } catch (err) {
    console.error('[Seeder] Failed to seed default admin:', err.message);
  }
};

// Synchronize database models and start listening
const startServer = async () => {
  try {
    const health = await testConnection();

    if (health.success) {
      // Sync tables silently
      await sequelize.sync({ alter: true });

      // Run seed check silently
      await seedDefaultAdmin();
      await seedQuestions();

      // Backfill recruiter name/phone for existing candidates
      try {
        const candidatesToBackfill = await Candidate.findAll({
          where: {
            mobiliserId: { [Op.ne]: null },
            [Op.or]: [
              { recruiterName: null },
              { recruiterPhone: null }
            ]
          }
        });

        if (candidatesToBackfill.length > 0) {
          console.log(`[Backfill] Found ${candidatesToBackfill.length} candidates missing recruiter details. Backfilling...`);
          for (const candidate of candidatesToBackfill) {
            const recruiter = await User.findByPk(candidate.mobiliserId);
            if (recruiter) {
              await candidate.update({
                recruiterName: recruiter.username,
                recruiterPhone: recruiter.phone
              });
            }
          }
        }
      } catch (backfillErr) {
        console.error('[Backfill] Error during candidate recruiter backfill:', backfillErr.message);
      }

      // Backfill candidate status if null
      try {
        const candidatesToBackfillStatus = await Candidate.findAll({
          where: {
            status: null
          }
        });

        if (candidatesToBackfillStatus.length > 0) {
          console.log(`[Backfill] Found ${candidatesToBackfillStatus.length} candidates missing status. Backfilling to 'pending'...`);
          for (const candidate of candidatesToBackfillStatus) {
            await candidate.update({ status: 'pending' });
          }
        }
      } catch (statusBackfillErr) {
        console.error('[Backfill] Error during candidate status backfill:', statusBackfillErr.message);
      }
    }

    // Start Express Web Server
    app.listen(PORT, () => {
      if (health.success) {
        console.log(`[Server] running on port ${PORT} (Database Connected & Synced)`);
      } else {
        console.warn('[Database] Warning: Sync skipped (Database is unreachable).');
        console.log(`[Server] running on port ${PORT} (Database Offline)`);
      }
    });
  } catch (error) {
    console.error('[Express] Server failed to start:', error.message);
  }
};

startServer();
