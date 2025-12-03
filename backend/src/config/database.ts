import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL Connection Pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : undefined,
  max: 20, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection cannot be established
});

// Connection event handlers
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL error:', err);
  process.exit(-1);
});

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const result = await pool.query('SELECT NOW() as current_time, version() as db_version');
    console.log('📊 Database time:', result.rows[0].current_time);
    console.log('📊 PostgreSQL version:', result.rows[0].db_version.split(',')[0]);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Closing database connections...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Closing database connections...');
  await pool.end();
  process.exit(0);
});
