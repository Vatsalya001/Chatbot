import { Pool } from 'pg';
import { createClient } from 'redis';

// PostgreSQL connection pool
let pool: Pool | null = null;

export const getDbPool = (): Pool => {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
    
    if (!connectionString) {
      throw new Error('Database connection string not found. Set DATABASE_URL or SUPABASE_DB_URL environment variable.');
    }

    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 5, // Limit connections for serverless
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  
  return pool;
};

// Redis connection
let redisClient: any = null;

export const getRedisClient = async () => {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL;
    
    if (!redisUrl) {
      console.warn('Redis URL not found. Caching will be disabled.');
      return null;
    }

    redisClient = createClient({
      url: redisUrl,
    });

    redisClient.on('error', (err: any) => {
      console.error('Redis Client Error:', err);
    });

    await redisClient.connect();
  }
  
  return redisClient;
};

// Database initialization
export const initializeDatabase = async (): Promise<void> => {
  const pool = getDbPool();
  
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      avatar VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createCommentsTable = `
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL,
      author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
      post_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createNotificationsTable = `
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(50) NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createUsersTable);
    await pool.query(createCommentsTable);
    await pool.query(createNotificationsTable);
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Cleanup function for serverless
export const cleanup = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
  }
  
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};