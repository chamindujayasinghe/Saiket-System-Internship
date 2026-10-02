// In-memory data store for users.
// Data resets every time the server restarts (Task 5 replaces this with a database).

const seedUsers = [
  { id: 1, name: 'Amaya Perera', email: 'amaya@example.com', age: 24 },
  { id: 2, name: 'Daniel Fernando', email: 'daniel@example.com', age: 31 },
  { id: 3, name: 'Nimali Silva', email: 'nimali@example.com', age: 28 },
];

let users = [];
let nextId = 1;

export function reset() {
  users = seedUsers.map((user) => ({ ...user, createdAt: new Date().toISOString() }));
  nextId = users.length + 1;
}

export function findAll() {
  return users;
}

export function findById(id) {
  return users.find((user) => user.id === id);
}

export function findByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function create({ name, email, age }) {
  const user = { id: nextId++, name, email, age, createdAt: new Date().toISOString() };
  users.push(user);
  return user;
}

export function update(id, changes) {
  const user = findById(id);
  if (!user) return null;
  Object.assign(user, changes, { updatedAt: new Date().toISOString() });
  return user;
}

export function remove(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) return false;
  users.splice(index, 1);
  return true;
}

reset();
