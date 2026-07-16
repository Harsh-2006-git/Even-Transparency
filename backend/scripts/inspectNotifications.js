import dotenv from 'dotenv'; dotenv.config();
import sequelize from '../config/db.js';
import { QueryTypes } from 'sequelize';

await sequelize.authenticate();

const cols = await sequelize.query(
  "SELECT column_name FROM information_schema.columns WHERE table_name='adminnotifications' ORDER BY ordinal_position",
  { type: QueryTypes.SELECT }
);
console.log('COLUMNS:', cols.map(c => c.column_name).join(', '));

const rows = await sequelize.query(
  'SELECT * FROM adminnotifications ORDER BY created_at DESC LIMIT 5',
  { type: QueryTypes.SELECT }
);
console.log('SAMPLE DATA:', JSON.stringify(rows, null, 2));

await sequelize.close();
