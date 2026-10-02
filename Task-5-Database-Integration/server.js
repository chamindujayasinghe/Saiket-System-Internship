import app from './app.js';
import { ping } from './models/userModel.js';
import { dbConfig } from './db/config.js';

const PORT = process.env.PORT || 3000;

try {
  await ping();
  console.log(`✓ Connected to MySQL database "${dbConfig.database}" on ${dbConfig.host}:${dbConfig.port}`);
} catch (err) {
  console.warn(`⚠ Could not connect to MySQL (${err.code || err.message}). Requests will return 503 until it is reachable.`);
  console.warn('  Check your .env file, then run "npm run db:init".');
}

app.listen(PORT, () => {
  console.log(`User API running at http://localhost:${PORT}`);
});
