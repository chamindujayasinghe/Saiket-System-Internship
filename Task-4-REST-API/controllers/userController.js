import * as User from '../data/userStore.js';

// GET /api/users
export function getUsers(req, res) {
  res.json(User.findAll());
}

// GET /api/users/:id
export function getUser(req, res) {
  const user = User.findById(req.userId);
  if (!user) return res.status(404).json({ error: `User with id ${req.userId} not found` });
  res.json(user);
}

// POST /api/users
export function createUser(req, res) {
  if (User.findByEmail(req.validated.email)) {
    return res.status(409).json({ error: 'A user with this email already exists' });
  }
  const user = User.create(req.validated);
  res.status(201).location(`/api/users/${user.id}`).json(user);
}

// PUT /api/users/:id (full replace) and PATCH /api/users/:id (partial update)
export function updateUser(req, res) {
  if (!User.findById(req.userId)) {
    return res.status(404).json({ error: `User with id ${req.userId} not found` });
  }

  const { email } = req.validated;
  const existing = email && User.findByEmail(email);
  if (existing && existing.id !== req.userId) {
    return res.status(409).json({ error: 'A user with this email already exists' });
  }

  res.json(User.update(req.userId, req.validated));
}

// DELETE /api/users/:id
export function deleteUser(req, res) {
  if (!User.remove(req.userId)) {
    return res.status(404).json({ error: `User with id ${req.userId} not found` });
  }
  res.status(204).end();
}
