import mysql from 'mysql2/promise';
import { dbConfig } from './config.js';

// A connection pool reuses a small set of connections instead of
// opening a new one for every request.
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
