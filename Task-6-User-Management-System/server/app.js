import express from 'express';
import cors from 'cors';
import userRoutes from './routes/users.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { ping } from './models/userModel.js';

const app = express();

// Only the React client may call the API from a browser.
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// API index: a quick overview of the available endpoints.
app.get('/', (req, res) => {
  res.json({
    name: 'User Management API',
    version: '3.0.0',
    endpoints: {
      'GET /api/health': 'API and database status',
      'GET /api/users?search=': 'List users (optional search by name or email)',
      'GET /api/users/:id': 'Get one user',
      'POST /api/users': 'Create a user',
      'PUT /api/users/:id': 'Replace a user (all fields)',
      'PATCH /api/users/:id': 'Update some fields of a user',
      'DELETE /api/users/:id': 'Delete a user',
    },
  });
});

// Health check: confirms the API can reach the database.
app.get('/api/health', async (req, res) => {
  try {
    await ping();
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', database: 'unreachable' });
  }
});

app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
