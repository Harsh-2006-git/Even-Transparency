import { Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const remoteUrl = 'postgres://avnadmin:AVNS_5wlaG9CNiIJ9f6WiYvv@apprenticeship-harshhmanmode-7621.e.aivencloud.com:19869/defaultdb';
const seq = new Sequelize(remoteUrl, {
  dialect: 'postgres',
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  logging: false
});

async function run() {
  try {
    await seq.authenticate();
    console.log('✓ Connected to Remote Aiven Database.');

    const { QueryTypes } = seq;
    const rawTables = await seq.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name LIKE 'portal_%';
    `, { type: QueryTypes.SELECT });

    console.log('rawTables length:', rawTables.length);
    console.log('rawTables sample:', rawTables.slice(0, 5));
    const allPortalTables = rawTables.map(r => r.table_name || r.TABLE_NAME || Object.values(r)[0]).filter(Boolean);
    console.log(`Found ${allPortalTables.length} total portal_ tables:`, allPortalTables);

    // Truncate all portal_ tables EXCEPT portal_users
    const tablesToTruncate = allPortalTables.filter(t => t !== 'portal_users');
    console.log(`Truncating ${tablesToTruncate.length} tables (preserving portal_users)...`);

    for (const tbl of tablesToTruncate) {
      await seq.query(`TRUNCATE TABLE "${tbl}" RESTART IDENTITY CASCADE;`);
      console.log(`  ✓ Truncated ${tbl}`);
    }

    // 2. Clean portal_users, keeping ONLY admin@transparency.in
    await seq.query(`DELETE FROM portal_users WHERE email != 'admin@transparency.in';`);
    console.log('  ✓ Deleted non-admin users from portal_users.');

    const [adminRows] = await seq.query(`SELECT id FROM portal_users WHERE email = 'admin@transparency.in';`);
    const hash = await bcrypt.hash('admin@123', 10);
    const now = new Date();

    if (adminRows.length > 0) {
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

    console.log('\n🎉 ALL remote project portal_* data successfully truncated and wiped clean!');
    await seq.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error cleaning remote database:', err.message);
    process.exit(1);
  }
}

run();
