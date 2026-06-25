import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env file from the parent (backend root) directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function truncateDb() {
  console.log('=========================================');
  console.log('⏳ Starting Database Truncation...');
  console.log('=========================================');
  try {
    // Dynamically import sequelize after loading the environment variables
    const { default: sequelize } = await import('../config/db.js');

    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    const queryInterface = sequelize.getQueryInterface();
    const tables = await queryInterface.showAllTables();
    
    console.log(`📋 Found ${tables.length} tables to truncate.`);

    // Truncate tables using a transaction
    await sequelize.transaction(async (t) => {
      for (const table of tables) {
        // Skip migration meta tables if any
        if (table === 'SequelizeMeta' || table === 'spatial_ref_sys') {
          console.log(`⏭️ Skipping meta table: ${table}`);
          continue;
        }
        
        console.log(`✨ Truncating table: ${table}...`);
        await sequelize.query(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`, { transaction: t });
      }
    });

    console.log('=========================================');
    console.log('🎉 Database truncated successfully!');
    console.log('=========================================');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database truncation:', error);
    process.exit(1);
  }
}

truncateDb();
