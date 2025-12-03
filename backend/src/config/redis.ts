import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Redis Client Configuration
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error('❌ Redis reconnection failed after 10 attempts');
        return new Error('Redis reconnection limit exceeded');
      }
      const delay = retries * 100; // Exponential backoff: 100ms, 200ms, 300ms, etc.
      console.log(`⏳ Redis reconnecting in ${delay}ms... (attempt ${retries})`);
      return delay;
    }
  }
});

// Connection event handlers
redisClient.on('connect', () => {
  console.log('🔗 Connecting to Redis...');
});

redisClient.on('ready', () => {
  console.log('✅ Redis client ready');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err.message);
});

redisClient.on('reconnecting', () => {
  console.log('🔄 Redis reconnecting...');
});

redisClient.on('end', () => {
  console.log('🛑 Redis connection closed');
});

// Connect to Redis
export const connectRedis = async (): Promise<boolean> => {
  try {
    await redisClient.connect();

    // Test connection with PING
    const pong = await redisClient.ping();
    console.log('🏓 Redis PING:', pong);

    // Get server info
    const info = await redisClient.info('server');
    const version = info.match(/redis_version:([^\r\n]+)/)?.[1];
    console.log('📊 Redis version:', version);

    return true;
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    return false;
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Closing Redis connection...');
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Closing Redis connection...');
  await redisClient.quit();
  process.exit(0);
});

export { redisClient };
