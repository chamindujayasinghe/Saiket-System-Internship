import * as User from '../models/userModel.js';

// Express 5 passes errors from async handlers to the error handler automatically,
// so database errors (e.g. duplicate email) are handled in middleware/errorHandler.js.

// GET /api/users
export async function getUsers(req, res) {
  res.json(await User.findAll());
}

// GET /api/users/:id
export async function getUser(req, res) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: `User with id ${req.userId} not found` });
  res.json(user);
}

// POST /api/users
export async function createUser(req, res) {
  const user = await User.create(req.validated);
  res.status(201).location(`/api/users/${user.id}`).json(user);
}

// PUT /api/users/:id (full replace) and PATCH /api/users/:id (partial update)
export async function updateUser(req, res) {
  const user = await User.update(req.userId, req.validated);
  if (!user) return res.status(404).json({ error: `User with id ${req.userId} not found` });
  res.json(user);
}

// DELETE /api/users/:id
export async function deleteUser(req, res) {
  if (!(await User.remove(req.userId))) {
    return res.status(404).json({ error: `User with id ${req.userId} not found` });
  }
  res.status(204).end();
}
