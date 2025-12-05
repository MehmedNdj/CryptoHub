import app from './app';
import { testConnection as testDatabase } from './config/database';
import { connectRedis } from './config/redis';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

/**
 * Start the server
 */
const startServer = async () => {
  try {
    console.log('🚀 Starting CryptoHub Backend Server...\n');

    // Test database connection
    console.log('📊 Connecting to PostgreSQL...');
    const dbConnected = await testDatabase();
    if (!dbConnected) {
      throw new Error('Failed to connect to PostgreSQL');
    }

    // Connect to Redis
    console.log('\n🔴 Connecting to Redis...');
    const redisConnected = await connectRedis();
    if (!redisConnected) {
      throw new Error('Failed to connect to Redis');
    }

    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n✅ Server running on http://localhost:${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`\n🔗 Available endpoints:`);
      console.log(`   - POST http://localhost:${PORT}/api/auth/register`);
      console.log(`   - POST http://localhost:${PORT}/api/auth/login`);
      console.log(`   - GET  http://localhost:${PORT}/api/auth/me`);
      console.log(`   - GET  http://localhost:${PORT}/health`);
      console.log('\n🎉 Server is ready!\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
