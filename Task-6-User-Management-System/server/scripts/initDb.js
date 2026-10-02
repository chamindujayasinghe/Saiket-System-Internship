// Creates the database and users table, then inserts sample data.
//   npm run db:init    create if missing (safe to run again)
//   npm run db:reset   drop the users table and start fresh
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import { dbConfig } from '../db/config.js';

const readSql = (name) => readFile(new URL(`../db/${name}`, import.meta.url), 'utf8');

export async function initDatabase({ reset = false, database = dbConfig.database } = {}) {
  if (!/^\w+$/.test(database)) throw new Error(`Invalid database name: ${database}`);

  // Connect to the server without choosing a database, since it may not exist yet.
  const { database: _unused, ...serverConfig } = dbConfig;
  const connection = await mysql.createConnection({ ...serverConfig, multipleStatements: true });

  try {
    // schema.sql uses "saiket_users"; swap in the configured name.
    const schema = (await readSql('schema.sql')).replaceAll('saiket_users', database);
    const seed = await readSql('seed.sql');

    if (reset) {
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
      await connection.query(`DROP TABLE IF EXISTS \`${database}\`.users`);
    }
    await connection.query(schema);
    await connection.query(seed);
  } finally {
    await connection.end();
  }
}

// Only run when called directly (not when imported by the tests).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const reset = process.argv.includes('--reset');
  try {
    await initDatabase({ reset });
    console.log(`✓ Database "${dbConfig.database}" is ready${reset ? ' (reset)' : ''}.`);
  } catch (err) {
    console.error(`✗ Could not set up the database: ${err.message}`);
    if (err.code === 'ER_ACCESS_DENIED_ERROR') console.error('  Check DB_USER and DB_PASSWORD in your .env file.');
    if (err.code === 'ECONNREFUSED') console.error('  Is the MySQL server running? Check DB_HOST and DB_PORT.');
    process.exitCode = 1;
  }
}
