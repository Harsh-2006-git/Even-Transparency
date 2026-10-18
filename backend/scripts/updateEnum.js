import db from '../models/index.js';

async function updateEnum() {
  try {
    const rolesToAdd = ['employer', 'Employer', 'candidate', 'partner', 'Partner', 'staff', 'Staff'];
    for (const r of rolesToAdd) {
      try {
        await db.sequelize.query(`ALTER TYPE enum_portal_users_role ADD VALUE IF NOT EXISTS '${r}'`);
        console.log(`Added enum value: ${r}`);
      } catch (err) {
        console.log(`Notice for enum value ${r}:`, err.message);
      }
    }
    const [res] = await db.sequelize.query('SELECT enum_range(NULL::enum_portal_users_role)');
    console.log('Updated enum_portal_users_role range:', res);
    const assessmentTypes = ['BATTERY_SWAP', 'ROAD_SAFETY', 'DIGITAL_APP', 'FINAL_CERTIFICATION'];
    for (const a of assessmentTypes) {
      try {
        await db.sequelize.query(`ALTER TYPE enum_portal_training_assessments_assessment_type ADD VALUE IF NOT EXISTS '${a}'`);
        console.log(`Added assessment type: ${a}`);
      } catch (err) {
        console.log(`Notice for assessment type ${a}:`, err.message);
      }
    }
  } catch (error) {
    console.error('Fatal error updating enum:', error);
  } finally {
    process.exit(0);
  }
}

updateEnum();
