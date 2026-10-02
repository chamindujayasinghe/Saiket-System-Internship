import express from 'express';
import cors from 'cors';
import userRoutes from './routes/users.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { ping } from './models/userModel.js';

const app = express();

app.use(cors());
app.use(express.json());

// API index: a quick overview of the available endpoints.
app.get('/', (req, res) => {
  res.json({
    name: 'User REST API (MySQL)',
    version: '2.0.0',
    endpoints: {
      'GET /api/health': 'API and database status',
      'GET /api/users': 'List all users',
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
