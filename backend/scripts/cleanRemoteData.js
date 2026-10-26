import { Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const remoteUrl = 'postgres://avnadmin:AVNS_5wlaG9CNiIJ9f6WiYvv@apprenticeship-harshhmanmode-7621.e.aivencloud.com:19869/defaultdb';
const seq = new Sequelize(remoteUrl, {
  dialect: 'postgres',
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  logging: false
});

// Explicit list of this project's tables ONLY
const projectTables = [
  'candidate_deployments',
  'employment_records',
  'employment_trackings',
  'retention_trackings',
  'retention_milestones',
  'performance_feedbacks',
  'safety_incidents',
  'employment_exits',
  'exit_reasons',
  'job_opportunities',
  'batch_enrollments',
  'training_assessments',
  'training_attendances',
  'trainer_feedbacks',
  'trainer_observations',
  'training_recommendations',
  'candidate_certifications',
  'batch_modules',
  'training_batches',
  'training_modules',
  'candidate_documents',
  'candidate_readiness',
  'candidate_stage_histories',
  'candidate_risk_flags',
  'mobilization_records',
  'mobilization_sources',
  'nf_classifications',
  'nf_classification_rules',
  'readiness_assessments',
  'readiness_criteria_rules',
  'portal_notifications',
  'portal_audit_logs',
  'candidates',
  'employers',
  'placement_coordinators',
  'trainers',
  'mobilizers',
  'partners',
  'training_centers',
  'organizations',
  'system_master_data'
];

async function run() {
  try {
    await seq.authenticate();
    console.log('✓ Connected to Remote Aiven Database.');

    // 1. Check which tables actually exist
    const rows = await seq.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN (:tables);
    `, {
      replacements: { tables: projectTables },
      type: seq.QueryTypes.SELECT
    });

    const tablesToTruncate = rows.map(r => r.table_name).filter(Boolean);
    console.log(`Found ${tablesToTruncate.length} project tables to truncate:`, tablesToTruncate);

    // 2. Truncate each project table safely
    for (const tbl of tablesToTruncate) {
      if (!tbl) continue;
      await seq.query(`TRUNCATE TABLE "${tbl}" RESTART IDENTITY CASCADE;`);
      console.log(`  ✓ Truncated ${tbl}`);
    }

    // 3. Clean portal_users, keeping ONLY admin@transparency.in
    const portalUserRows = await seq.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'portal_users';
    `, { type: seq.QueryTypes.SELECT });

    if (portalUserRows.length > 0) {
      // Delete all users except admin@transparency.in
      await seq.query(`DELETE FROM portal_users WHERE email != 'admin@transparency.in';`);
      console.log('  ✓ Deleted non-admin users from portal_users.');

      // Ensure admin@transparency.in exists with admin@123
      const adminExists = await seq.query(`
        SELECT id FROM portal_users WHERE email = 'admin@transparency.in';
      `, { type: seq.QueryTypes.SELECT });

      const hash = await bcrypt.hash('admin@123', 10);
      const now = new Date();

      if (adminExists.length > 0) {
        await seq.query(`
          UPDATE portal_users 
          SET password_hash = :hash, role = 'Super Admin', status = 'active', updated_at = :now 
          WHERE email = 'admin@transparency.in';
        `, { replacements: { hash, now } });
        console.log('  ✓ Verified and updated admin@transparency.in in portal_users.');
      } else {
        await seq.query(`
          INSERT INTO portal_users (id, email, password_hash, full_name, role, designation, department, status, permissions, created_at, updated_at)
          VALUES (:id, 'admin@transparency.in', :hash, 'Platform Administrator', 'Super Admin', 'Platform Super Administrator', 'Platform Governance', 'active', :permissions, :now, :now);
        `, {
          replacements: {
            id: uuidv4(),
            hash,
            permissions: JSON.stringify({ all: true }),
            now
          }
        });
        console.log('  ✓ Created admin@transparency.in (password: admin@123) in portal_users.');
      }
    }

    console.log('\n✅ Remote Aiven project data successfully wiped while retaining default admin user!');
    await seq.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error cleaning remote database:', err.message);
    process.exit(1);
  }
}

run();
