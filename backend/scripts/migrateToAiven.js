import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import db from '../models/index.js';

// Import model factories
import CandidateModel from '../models/candidate/Candidate.js';
import CandidateAddressModel from '../models/candidate/CandidateAddress.js';
import CandidateEducationModel from '../models/candidate/CandidateEducation.js';
import CandidateSkillModel from '../models/candidate/CandidateSkill.js';
import CandidateWorkExperienceModel from '../models/candidate/CandidateWorkExperience.js';
import CandidateDocumentModel from '../models/candidate/CandidateDocument.js';
import CandidateBankAccountModel from '../models/candidate/CandidateBankAccount.js';
import CandidateApplicationModel from '../models/candidate/CandidateApplication.js';
import CandidateTrainingRecordModel from '../models/candidate/CandidateTrainingRecord.js';
import CandidateAttendanceModel from '../models/candidate/CandidateAttendance.js';
import CandidateGrievanceModel from '../models/candidate/CandidateGrievance.js';
import EmployerModel from '../models/employer/Employer.js';
import EmployerLocationModel from '../models/employer/EmployerLocation.js';
import EmployerDocumentModel from '../models/employer/EmployerDocument.js';
import EmployerJobPostingModel from '../models/employer/EmployerJobPosting.js';
import EmployerUserModel from '../models/employer/EmployerUser.js';
import EmployerCandidatePipelineModel from '../models/employer/EmployerCandidatePipeline.js';
import EmployerInterviewModel from '../models/employer/EmployerInterview.js';
import EmployerApprenticeshipContractModel from '../models/employer/EmployerApprenticeshipContract.js';
import EmployerAttendanceLogModel from '../models/employer/EmployerAttendanceLog.js';
import EmployerTrainingLogModel from '../models/employer/EmployerTrainingLog.js';
import EmployerStipendPaymentModel from '../models/employer/EmployerStipendPayment.js';
import EmployerNapsFilingModel from '../models/employer/EmployerNapsFiling.js';
import EmployerGrievanceResponseModel from '../models/employer/EmployerGrievanceResponse.js';
import EmployerSubsidyClaimModel from '../models/employer/EmployerSubsidyClaim.js';
import EmployerEsgReportModel from '../models/employer/EmployerEsgReport.js';
import EmployerActivityLogModel from '../models/employer/EmployerActivityLog.js';
import AdminUserModel from '../models/admin/AdminUser.js';
import AdminRoleModel from '../models/admin/AdminRole.js';
import AdminCandidateVerificationQueueModel from '../models/admin/AdminCandidateVerificationQueue.js';
import AdminEmployerVerificationQueueModel from '../models/admin/AdminEmployerVerificationQueue.js';
import AdminJobPostingReviewModel from '../models/admin/AdminJobPostingReview.js';
import AdminNapsOperationModel from '../models/admin/AdminNapsOperation.js';
import AdminSubsidyClaimOperationModel from '../models/admin/AdminSubsidyClaimOperation.js';
import AdminGrievanceManagementModel from '../models/admin/AdminGrievanceManagement.js';
import AdminCandidateMatchingModel from '../models/admin/AdminCandidateMatching.js';
import AdminContentManagementModel from '../models/admin/AdminContentManagement.js';
import AdminNotificationModel from '../models/admin/AdminNotification.js';
import AdminReportModel from '../models/admin/AdminReport.js';
import AdminAuditLogModel from '../models/admin/AdminAuditLog.js';
import AdminDashboardMetricModel from '../models/admin/AdminDashboardMetric.js';
import AdminSystemSettingModel from '../models/admin/AdminSystemSetting.js';

dotenv.config();

const AIVEN_DB_URL = process.env.AIVEN_DB_URL || process.env.DATABASE_URL;

async function runMigration() {
  console.log('=== Database Migration: Neon -> Aiven ===');

  // 1. Initialize target Sequelize connection to Aiven
  console.log('Connecting to Target (Aiven) database...');
  const targetSequelize = new Sequelize(AIVEN_DB_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  });

  try {
    await targetSequelize.authenticate();
    console.log('Target (Aiven) database connection successful.');
  } catch (err) {
    console.error('Failed to connect to Aiven database:', err.message);
    process.exit(1);
  }

  // 2. Initialize models on Target database
  console.log('Initializing models on Target database...');
  const targetDb = {};
  targetDb.Candidate = CandidateModel(targetSequelize, Sequelize.DataTypes);
  targetDb.CandidateAddress = CandidateAddressModel(targetSequelize, Sequelize.DataTypes);
  targetDb.CandidateEducation = CandidateEducationModel(targetSequelize, Sequelize.DataTypes);
  targetDb.CandidateSkill = CandidateSkillModel(targetSequelize, Sequelize.DataTypes);
  targetDb.CandidateWorkExperience = CandidateWorkExperienceModel(targetSequelize, Sequelize.DataTypes);
  targetDb.CandidateDocument = CandidateDocumentModel(targetSequelize, Sequelize.DataTypes);
  targetDb.CandidateBankAccount = CandidateBankAccountModel(targetSequelize, Sequelize.DataTypes);
  targetDb.CandidateApplication = CandidateApplicationModel(targetSequelize, Sequelize.DataTypes);
  targetDb.CandidateTrainingRecord = CandidateTrainingRecordModel(targetSequelize, Sequelize.DataTypes);
  targetDb.CandidateAttendance = CandidateAttendanceModel(targetSequelize, Sequelize.DataTypes);
  targetDb.CandidateGrievance = CandidateGrievanceModel(targetSequelize, Sequelize.DataTypes);
  targetDb.Employer = EmployerModel(targetSequelize, Sequelize.DataTypes);
  targetDb.EmployerLocation = EmployerLocationModel(targetSequelize, Sequelize.DataTypes);
  targetDb.EmployerDocument = EmployerDocumentModel(targetSequelize, Sequelize.DataTypes);
  targetDb.EmployerJobPosting = EmployerJobPostingModel(targetSequelize, Sequelize.DataTypes);
  targetDb.EmployerUser = EmployerUserModel(targetSequelize, Sequelize.DataTypes);
  targetDb.EmployerCandidatePipeline = EmployerCandidatePipelineModel(targetSequelize, Sequelize.DataTypes);
  targetDb.EmployerInterview = EmployerInterviewModel(targetSequelize, Sequelize.DataTypes);
  targetDb.EmployerApprenticeshipContract = EmployerApprenticeshipContractModel(targetSequelize, Sequelize.DataTypes);
  targetDb.EmployerAttendanceLog = EmployerAttendanceLogModel(targetSequelize, Sequelize.DataTypes);
  targetDb.EmployerTrainingLog = EmployerTrainingLogModel(targetSequelize, Sequelize.DataTypes);
  targetDb.EmployerStipendPayment = EmployerStipendPaymentModel(targetSequelize, Sequelize.DataTypes);
  targetDb.EmployerNapsFiling = EmployerNapsFilingModel(targetSequelize, Sequelize.DataTypes);
  targetDb.EmployerGrievanceResponse = EmployerGrievanceResponseModel(targetSequelize, Sequelize.DataTypes);
  targetDb.EmployerSubsidyClaim = EmployerSubsidyClaimModel(targetSequelize, Sequelize.DataTypes);
  targetDb.EmployerEsgReport = EmployerEsgReportModel(targetSequelize, Sequelize.DataTypes);
  targetDb.EmployerActivityLog = EmployerActivityLogModel(targetSequelize, Sequelize.DataTypes);
  targetDb.AdminUser = AdminUserModel(targetSequelize, Sequelize.DataTypes);
  targetDb.AdminRole = AdminRoleModel(targetSequelize, Sequelize.DataTypes);
  targetDb.AdminCandidateVerificationQueue = AdminCandidateVerificationQueueModel(targetSequelize, Sequelize.DataTypes);
  targetDb.AdminEmployerVerificationQueue = AdminEmployerVerificationQueueModel(targetSequelize, Sequelize.DataTypes);
  targetDb.AdminJobPostingReview = AdminJobPostingReviewModel(targetSequelize, Sequelize.DataTypes);
  targetDb.AdminNapsOperation = AdminNapsOperationModel(targetSequelize, Sequelize.DataTypes);
  targetDb.AdminSubsidyClaimOperation = AdminSubsidyClaimOperationModel(targetSequelize, Sequelize.DataTypes);
  targetDb.AdminGrievanceManagement = AdminGrievanceManagementModel(targetSequelize, Sequelize.DataTypes);
  targetDb.AdminCandidateMatching = AdminCandidateMatchingModel(targetSequelize, Sequelize.DataTypes);
  targetDb.AdminContentManagement = AdminContentManagementModel(targetSequelize, Sequelize.DataTypes);
  targetDb.AdminNotification = AdminNotificationModel(targetSequelize, Sequelize.DataTypes);
  targetDb.AdminReport = AdminReportModel(targetSequelize, Sequelize.DataTypes);
  targetDb.AdminAuditLog = AdminAuditLogModel(targetSequelize, Sequelize.DataTypes);
  targetDb.AdminDashboardMetric = AdminDashboardMetricModel(targetSequelize, Sequelize.DataTypes);
  targetDb.AdminSystemSetting = AdminSystemSettingModel(targetSequelize, Sequelize.DataTypes);

  // Apply associations
  Object.keys(targetDb).forEach(modelName => {
    if (targetDb[modelName].associate) {
      targetDb[modelName].associate(targetDb);
    }
  });

  // 3. Sync schema (force create all tables on Aiven database)
  console.log('Syncing database schema on target database (creating empty tables)...');
  await targetSequelize.sync({ force: true });
  console.log('Database schema synchronized successfully on Target.');

  // Run ensure columns logic on Target database
  console.log('Running column level validations on target database...');
  await ensureTargetColumnsExist(targetSequelize);

  // 4. Migrate data table by table
  const modelKeys = Object.keys(db).filter(key => key !== 'sequelize' && key !== 'Sequelize');

  console.log(`Found ${modelKeys.length} models to migrate.`);

  // We will perform the inserts inside a replica-role transaction to disable foreign key checks
  const transaction = await targetSequelize.transaction();
  try {
    console.log('Disabling triggers and foreign key constraints for this session...');
    await targetSequelize.query("SET session_replication_role = 'replica';", { transaction });

    for (const modelKey of modelKeys) {
      const sourceModel = db[modelKey];
      const targetModel = targetDb[modelKey];

      const tableName = sourceModel.getTableName();
      console.log(`Migrating table ${tableName} (${modelKey})...`);

      // Fetch all records from source
      const records = await sourceModel.findAll({ raw: true });
      if (records.length === 0) {
        console.log(`- Table ${tableName} is empty. Skipping.`);
        continue;
      }

      console.log(`- Fetched ${records.length} records from source.`);

      // Insert into target
      await targetModel.bulkCreate(records, {
        transaction,
        validate: false,
        hooks: false,
        returning: false
      });
      console.log(`- Successfully inserted ${records.length} records into target.`);
    }

    console.log('Re-enabling triggers and constraints...');
    await targetSequelize.query("SET session_replication_role = 'origin';", { transaction });

    console.log('Committing transaction...');
    await transaction.commit();
    console.log('Data migration transaction committed successfully!');

  } catch (error) {
    console.error('Migration failed during data copy! Rolling back...', error);
    await transaction.rollback();
    process.exit(1);
  }

  // 5. Reset serial/identity sequences on Target PostgreSQL
  console.log('Resetting database serial/identity sequences on target...');
  try {
    await targetSequelize.query(`
      DO $$
      DECLARE
          r RECORD;
      BEGIN
          FOR r IN (
              SELECT table_name, column_name
              FROM information_schema.columns
              WHERE table_schema = 'public'
                AND column_default LIKE 'nextval(%'
          ) LOOP
              EXECUTE 'SELECT setval(''' || 
                  pg_get_serial_sequence(r.table_name, r.column_name) || 
                  ''', COALESCE(MAX(' || quote_ident(r.column_name) || '), 1)) FROM ' || quote_ident(r.table_name);
          END LOOP;
      END;
      $$;
    `);
    console.log('Successfully reset all auto-increment sequences.');
  } catch (seqError) {
    console.warn('Warning: Could not reset sequences automatically. Check manually if needed:', seqError.message);
  }

  console.log('\n=========================================');
  console.log('Migration Completed Successfully!');
  console.log('=========================================');

  await targetSequelize.close();
  // Close source connection
  await db.sequelize.close();
  process.exit(0);
}

async function ensureTargetColumnsExist(sequelizeInstance) {
  const queryInterface = sequelizeInstance.getQueryInterface();

  // 1. Check candidates table
  const candidatesTable = await queryInterface.describeTable('candidates').catch(() => null);
  if (candidatesTable) {
    const candidateColumns = [
      ['password_hash', { type: sequelizeInstance.Sequelize.STRING, allowNull: true }],
      ['profile_completion_breakdown', { type: sequelizeInstance.Sequelize.JSONB, allowNull: true }],
      ['profile_completion_percentage', { type: sequelizeInstance.Sequelize.FLOAT, allowNull: true }],
      ['onboarding_status', { type: sequelizeInstance.Sequelize.STRING, allowNull: true }],
      ['verification_status', { type: sequelizeInstance.Sequelize.STRING, allowNull: true }],
      ['availability_status', { type: sequelizeInstance.Sequelize.STRING, allowNull: true }],
      ['mobile_otp_verified', { type: sequelizeInstance.Sequelize.BOOLEAN, allowNull: true }],
      ['resume_url', { type: sequelizeInstance.Sequelize.STRING, allowNull: true }],
      ['category_certificate_url', { type: sequelizeInstance.Sequelize.STRING, allowNull: true }],
      ['emergency_contact_name', { type: sequelizeInstance.Sequelize.STRING, allowNull: true }],
      ['emergency_contact_relation', { type: sequelizeInstance.Sequelize.STRING, allowNull: true }],
      ['emergency_contact_phone', { type: sequelizeInstance.Sequelize.STRING, allowNull: true }],
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
      ['body', { type: sequelizeInstance.Sequelize.TEXT, allowNull: true }],
      ['channel', { type: sequelizeInstance.Sequelize.STRING, allowNull: true }],
      ['channels', { type: sequelizeInstance.Sequelize.ARRAY(sequelizeInstance.Sequelize.STRING), allowNull: true }],
      ['is_silent', { type: sequelizeInstance.Sequelize.BOOLEAN, allowNull: true }],
      ['sent_by_admin_id', { type: sequelizeInstance.Sequelize.UUID, allowNull: true }],
      ['scheduled_at', { type: sequelizeInstance.Sequelize.DATE, allowNull: true }],
      ['sent_at', { type: sequelizeInstance.Sequelize.DATE, allowNull: true }],
      ['delivered_at', { type: sequelizeInstance.Sequelize.DATE, allowNull: true }],
      ['read_at', { type: sequelizeInstance.Sequelize.DATE, allowNull: true }],
      ['is_read', { type: sequelizeInstance.Sequelize.BOOLEAN, allowNull: true }],
      ['failure_reason', { type: sequelizeInstance.Sequelize.STRING, allowNull: true }],
      ['retry_count', { type: sequelizeInstance.Sequelize.FLOAT, allowNull: true }],
      ['entity_type', { type: sequelizeInstance.Sequelize.STRING, allowNull: true }],
      ['entity_id', { type: sequelizeInstance.Sequelize.UUID, allowNull: true }],
      ['action_url', { type: sequelizeInstance.Sequelize.STRING, allowNull: true }],
      ['fcm_message_id', { type: sequelizeInstance.Sequelize.STRING, allowNull: true }],
      ['msg91_message_id', { type: sequelizeInstance.Sequelize.STRING, allowNull: true }]
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
      ['location', { type: sequelizeInstance.Sequelize.STRING, allowNull: true }],
      ['benefits', { type: sequelizeInstance.Sequelize.JSONB, allowNull: true }],
      ['preferred_criteria', { type: sequelizeInstance.Sequelize.TEXT, allowNull: true }]
    ];

    for (const [columnName, definition] of jobColumns) {
      if (!jobPostingsTable[columnName]) {
        await queryInterface.addColumn('employerjobpostings', columnName, definition);
        console.log(`Added missing employerjobpostings.${columnName} column.`);
      }
    }

    if (jobPostingsTable['job_description'] && jobPostingsTable['job_description'].type.toLowerCase().includes('varying')) {
      await queryInterface.changeColumn('employerjobpostings', 'job_description', {
        type: sequelizeInstance.Sequelize.TEXT,
        allowNull: true
      });
      console.log('Altered employerjobpostings.job_description column to TEXT.');
    }
  }

  // 4. Check candidategrievances table
  const grievancesTable = await queryInterface.describeTable('candidategrievances').catch(() => null);
  if (grievancesTable) {
    const grievanceColumns = [
      ['filed_by', { type: sequelizeInstance.Sequelize.STRING, allowNull: true, defaultValue: 'Candidate' }],
      ['evidence_urls', { type: sequelizeInstance.Sequelize.JSON, allowNull: true }],
      ['related_to', { type: sequelizeInstance.Sequelize.STRING, allowNull: true }]
    ];

    for (const [columnName, definition] of grievanceColumns) {
      if (!grievancesTable[columnName]) {
        await queryInterface.addColumn('candidategrievances', columnName, definition);
        console.log(`Added missing candidategrievances.${columnName} column.`);
      }
    }

    if (grievancesTable['grievance_description'] && grievancesTable['grievance_description'].type.toLowerCase().includes('varying')) {
      await queryInterface.changeColumn('candidategrievances', 'grievance_description', {
        type: sequelizeInstance.Sequelize.TEXT,
        allowNull: true
      });
      console.log('Altered candidategrievances.grievance_description column to TEXT.');
    }

    if (grievancesTable['resolution_notes'] && grievancesTable['resolution_notes'].type.toLowerCase().includes('varying')) {
      await queryInterface.changeColumn('candidategrievances', 'resolution_notes', {
        type: sequelizeInstance.Sequelize.TEXT,
        allowNull: true
      });
      console.log('Altered candidategrievances.resolution_notes column to TEXT.');
    }

    if (grievancesTable['evidence_urls'] && grievancesTable['evidence_urls'].type.toLowerCase().includes('varying')) {
      await queryInterface.changeColumn('candidategrievances', 'evidence_urls', {
        type: sequelizeInstance.Sequelize.JSON,
        allowNull: true
      });
      console.log('Altered candidategrievances.evidence_urls column to JSON.');
    }
  }
}

runMigration();
