import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is not defined.');
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false, // Turn on console.log if you want to see detailed SQL queries in the logs
  dialectOptions: {
    // Enable SSL if connecting to a non-local database (e.g. Supabase, Render, Heroku)
    ssl: databaseUrl && !databaseUrl.includes('localhost') && !databaseUrl.includes('127.0.0.1')
      ? { rejectUnauthorized: false }
      : false
  }
});

/**
 * Health check helper to verify connection to PostgreSQL via Sequelize
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    return {
      success: true,
      message: 'Successfully connected to PostgreSQL database via Sequelize.'
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to connect to database: ${error.message}`
    };
  }
};

export default sequelize;
