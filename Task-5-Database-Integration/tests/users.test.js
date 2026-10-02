// Endpoint tests against a real MySQL database (run: npm test).
// They use a separate "<DB_NAME>_test" database so your real data is never touched.
import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// Must be set before the app (and its connection pool) is imported.
process.env.DB_NAME = `${process.env.DB_NAME || 'saiket_users'}_test`;

const { initDatabase } = await import('../scripts/initDb.js');
const { default: app } = await import('../app.js');
const { default: pool } = await import('../db/pool.js');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://localhost:${server.address().port}/api/users`;
});

after(async () => {
  server.close();
  await pool.end();
});

beforeEach(() => initDatabase({ reset: true, database: process.env.DB_NAME }));

const request = (path, method = 'GET', body) =>
  fetch(`${baseUrl}${path}`, {
    method,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : {},
    body: body !== undefined ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
  });

test('GET /api/health reports the database as connected', async () => {
  const res = await fetch(baseUrl.replace('/users', '/health'));
  assert.equal(res.status, 200);
  assert.equal((await res.json()).database, 'connected');
});

test('GET /api/users returns seeded users from the database', async () => {
  const res = await request('');
  assert.equal(res.status, 200);
  const users = await res.json();
  assert.equal(users.length, 3);
  assert.deepEqual(Object.keys(users[0]), ['id', 'name', 'email', 'age', 'createdAt', 'updatedAt']);
});

test('POST creates a row that persists in MySQL', async () => {
  const res = await request('', 'POST', { name: 'Kasun Jay', email: 'Kasun@Example.com', age: 22 });
  assert.equal(res.status, 201);
  const user = await res.json();
  assert.equal(user.email, 'kasun@example.com');

  const [rows] = await pool.query('SELECT name, age FROM users WHERE id = ?', [user.id]);
  assert.deepEqual({ ...rows[0] }, { name: 'Kasun Jay', age: 22 });
});

test('POST rejects invalid data and duplicate emails', async () => {
  assert.equal((await request('', 'POST', { name: '', email: 'bad', age: 0 })).status, 400);
  assert.equal((await request('', 'POST', { name: 'Copy', email: 'amaya@example.com', age: 30 })).status, 409);
});

test('GET /:id returns one user, 404 when missing, 400 when invalid', async () => {
  assert.equal((await (await request('/2')).json()).name, 'Daniel Fernando');
  assert.equal((await request('/999')).status, 404);
  assert.equal((await request('/abc')).status, 400);
});

test('PUT replaces and PATCH partially updates a user', async () => {
  const put = await request('/1', 'PUT', { name: 'Amaya P.', email: 'amaya.p@example.com', age: 25 });
  assert.equal(put.status, 200);
  assert.equal((await put.json()).email, 'amaya.p@example.com');

  const patch = await request('/1', 'PATCH', { age: 26 });
  const user = await patch.json();
  assert.equal(user.age, 26);
  assert.equal(user.name, 'Amaya P.');
  assert.ok(user.updatedAt, 'updatedAt is set by MySQL');

  assert.equal((await request('/1', 'PATCH', { email: 'daniel@example.com' })).status, 409);
  assert.equal((await request('/999', 'PATCH', { age: 30 })).status, 404);
});

test('DELETE removes the row', async () => {
  assert.equal((await request('/3', 'DELETE')).status, 204);
  const [rows] = await pool.query('SELECT COUNT(*) AS count FROM users WHERE id = 3');
  assert.equal(rows[0].count, 0);
  assert.equal((await request('/3', 'DELETE')).status, 404);
});

test('SQL injection attempts are treated as plain data', async () => {
  const res = await request('', 'POST', { name: "Robert'); DROP TABLE users;--", email: 'bobby@example.com', age: 20 });
  assert.equal(res.status, 201);
  assert.equal((await res.json()).name, "Robert'); DROP TABLE users;--");
  assert.equal((await (await request('')).json()).length, 4);
});
