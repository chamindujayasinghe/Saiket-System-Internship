import dotenv from 'dotenv';

dotenv.config({ quiet: true });

// Connection settings, read from .env (see .env.example).
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'saiket_users',
};
