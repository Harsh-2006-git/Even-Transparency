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
import { uploadProxy } from './controllers/candidate/documentController.js';
import './models/index.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

async function ensureDbColumnsExist() {
  const queryInterface = sequelize.getQueryInterface();

  // 1. Check candidates table
  const candidatesTable = await queryInterface.describeTable('candidates').catch(() => null);
  if (candidatesTable) {
    const candidateColumns = [
      ['password_hash', { type: sequelize.Sequelize.STRING, allowNull: true }],
      ['profile_completion_breakdown', { type: sequelize.Sequelize.JSONB, allowNull: true }],
      ['profile_completion_percentage', { type: sequelize.Sequelize.FLOAT, allowNull: true }],
      ['onboarding_status', { type: sequelize.Sequelize.STRING, allowNull: true }],
      ['verification_status', { type: sequelize.Sequelize.STRING, allowNull: true }],
      ['availability_status', { type: sequelize.Sequelize.STRING, allowNull: true }],
      ['mobile_otp_verified', { type: sequelize.Sequelize.BOOLEAN, allowNull: true }],
      ['resume_url', { type: sequelize.Sequelize.STRING, allowNull: true }],
      ['category_certificate_url', { type: sequelize.Sequelize.STRING, allowNull: true }],
      ['emergency_contact_name', { type: sequelize.Sequelize.STRING, allowNull: true }],
      ['emergency_contact_relation', { type: sequelize.Sequelize.STRING, allowNull: true }],
      ['emergency_contact_phone', { type: sequelize.Sequelize.STRING, allowNull: true }],
    ];

    for (const [columnName, definition] of candidateColumns) {
      if (!candidatesTable[columnName]) {
        await queryInterface.addColumn('candidates', columnName, definition);
        console.log(`Added missing candidates.${columnName} column.`);
      }
    }
  }

  // 2. Check adminnotifications table
  const notificationsTable = await queryInterface.describeTable('adminnotifications').catch(() => null);
  if (notificationsTable) {
    const notificationColumns = [
      ['body', { type: sequelize.Sequelize.TEXT, allowNull: true }],
      ['channel', { type: sequelize.Sequelize.STRING, allowNull: true }],
      ['channels', { type: sequelize.Sequelize.ARRAY(sequelize.Sequelize.STRING), allowNull: true }],
      ['is_silent', { type: sequelize.Sequelize.BOOLEAN, allowNull: true }],
      ['sent_by_admin_id', { type: sequelize.Sequelize.UUID, allowNull: true }],
      ['scheduled_at', { type: sequelize.Sequelize.DATE, allowNull: true }],
      ['sent_at', { type: sequelize.Sequelize.DATE, allowNull: true }],
      ['delivered_at', { type: sequelize.Sequelize.DATE, allowNull: true }],
      ['read_at', { type: sequelize.Sequelize.DATE, allowNull: true }],
      ['is_read', { type: sequelize.Sequelize.BOOLEAN, allowNull: true }],
      ['failure_reason', { type: sequelize.Sequelize.STRING, allowNull: true }],
      ['retry_count', { type: sequelize.Sequelize.FLOAT, allowNull: true }],
      ['entity_type', { type: sequelize.Sequelize.STRING, allowNull: true }],
      ['entity_id', { type: sequelize.Sequelize.UUID, allowNull: true }],
      ['action_url', { type: sequelize.Sequelize.STRING, allowNull: true }],
      ['fcm_message_id', { type: sequelize.Sequelize.STRING, allowNull: true }],
      ['msg91_message_id', { type: sequelize.Sequelize.STRING, allowNull: true }]
    ];

    for (const [columnName, definition] of notificationColumns) {
      if (!notificationsTable[columnName]) {
        await queryInterface.addColumn('adminnotifications', columnName, definition);
        console.log(`Added missing adminnotifications.${columnName} column.`);
      }
    }
  }

  // 3. Check employerjobpostings table
  const jobPostingsTable = await queryInterface.describeTable('employerjobpostings').catch(() => null);
  if (jobPostingsTable) {
    const jobColumns = [
      ['location', { type: sequelize.Sequelize.STRING, allowNull: true }],
      ['benefits', { type: sequelize.Sequelize.JSONB, allowNull: true }],
      ['preferred_criteria', { type: sequelize.Sequelize.TEXT, allowNull: true }]
    ];

    for (const [columnName, definition] of jobColumns) {
      if (!jobPostingsTable[columnName]) {
        await queryInterface.addColumn('employerjobpostings', columnName, definition);
        console.log(`Added missing employerjobpostings.${columnName} column.`);
      }
    }

    // Alter job_description column type to TEXT if it's currently character varying
    if (jobPostingsTable['job_description'] && jobPostingsTable['job_description'].type.toLowerCase().includes('varying')) {
      await queryInterface.changeColumn('employerjobpostings', 'job_description', {
        type: sequelize.Sequelize.TEXT,
        allowNull: true
      });
      console.log('Altered employerjobpostings.job_description column to TEXT.');
    }
  }

  // 4. Check candidategrievances table
  const grievancesTable = await queryInterface.describeTable('candidategrievances').catch(() => null);
  if (grievancesTable) {
    const grievanceColumns = [
      ['filed_by', { type: sequelize.Sequelize.STRING, allowNull: true, defaultValue: 'Candidate' }],
      ['evidence_urls', { type: sequelize.Sequelize.JSON, allowNull: true }],
      ['related_to', { type: sequelize.Sequelize.STRING, allowNull: true }]
    ];

    for (const [columnName, definition] of grievanceColumns) {
      if (!grievancesTable[columnName]) {
        await queryInterface.addColumn('candidategrievances', columnName, definition);
        console.log(`Added missing candidategrievances.${columnName} column.`);
      }
    }

    // Alter grievance_description to TEXT if it's currently character varying
    if (grievancesTable['grievance_description'] && grievancesTable['grievance_description'].type.toLowerCase().includes('varying')) {
      await queryInterface.changeColumn('candidategrievances', 'grievance_description', {
        type: sequelize.Sequelize.TEXT,
        allowNull: true
      });
      console.log('Altered candidategrievances.grievance_description column to TEXT.');
    }

    // Alter resolution_notes to TEXT if it's currently character varying
    if (grievancesTable['resolution_notes'] && grievancesTable['resolution_notes'].type.toLowerCase().includes('varying')) {
      await queryInterface.changeColumn('candidategrievances', 'resolution_notes', {
        type: sequelize.Sequelize.TEXT,
        allowNull: true
      });
      console.log('Altered candidategrievances.resolution_notes column to TEXT.');
    }

    // Alter evidence_urls to JSON if it's currently character varying
    if (grievancesTable['evidence_urls'] && grievancesTable['evidence_urls'].type.toLowerCase().includes('varying')) {
      await queryInterface.changeColumn('candidategrievances', 'evidence_urls', {
        type: sequelize.Sequelize.JSON,
        allowNull: true
      });
      console.log('Altered candidategrievances.evidence_urls column to JSON.');
    }
  }
}

// Enable CORS for frontend connectivity
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://even-cargo-apprenticeship-portal.vercel.app'
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

app.put('/api/candidate/documents/upload-proxy', express.raw({ type: '*/*', limit: '10mb' }), uploadProxy);

app.use('/api', authRoutes);
app.use('/api', employerRoutes);
app.use('/api', candidateRoutes);
app.use('/api', notificationRoutes);

// Synchronize database models and start listening
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection successfully.');
    await ensureDbColumnsExist();
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
// Trigger environment config reload
