import express from 'express';
import cors from 'cors';
import userRoutes from './routes/users.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

// API index: a quick overview of the available endpoints.
app.get('/', (req, res) => {
  res.json({
    name: 'User REST API',
    version: '1.0.0',
    endpoints: {
      'GET /api/users': 'List all users',
      'GET /api/users/:id': 'Get one user',
      'POST /api/users': 'Create a user',
      'PUT /api/users/:id': 'Replace a user (all fields)',
      'PATCH /api/users/:id': 'Update some fields of a user',
      'DELETE /api/users/:id': 'Delete a user',
    },
  });
});

app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
