// Automated endpoint tests using Node's built-in test runner (run: npm test).
import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import app from '../app.js';
import { reset } from '../data/userStore.js';

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://localhost:${server.address().port}/api/users`;
});

after(() => server.close());
beforeEach(() => reset());

const request = (path, method = 'GET', body) =>
  fetch(`${baseUrl}${path}`, {
    method,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : {},
    body: body !== undefined ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
  });

test('GET /api/users returns all users', async () => {
  const res = await request('');
  assert.equal(res.status, 200);
  const users = await res.json();
  assert.equal(users.length, 3);
});

test('GET /api/users/:id returns one user', async () => {
  const res = await request('/1');
  assert.equal(res.status, 200);
  assert.equal((await res.json()).email, 'amaya@example.com');
});

test('GET /api/users/:id returns 404 for unknown id and 400 for bad id', async () => {
  assert.equal((await request('/999')).status, 404);
  assert.equal((await request('/abc')).status, 400);
});

test('POST /api/users creates a user', async () => {
  const res = await request('', 'POST', { name: '  Kasun Jay ', email: 'Kasun@Example.com', age: 22 });
  assert.equal(res.status, 201);
  const user = await res.json();
  assert.equal(user.id, 4);
  assert.equal(user.name, 'Kasun Jay');
  assert.equal(user.email, 'kasun@example.com');
  assert.equal(res.headers.get('location'), '/api/users/4');
});

test('POST /api/users validates input', async () => {
  const res = await request('', 'POST', { name: '', email: 'not-an-email', age: -3, role: 'admin' });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.details.length, 4);

  assert.equal((await request('', 'POST', { name: 'Al', email: 'al@example.com', age: '25' })).status, 400);
});

test('POST /api/users rejects duplicate email', async () => {
  const res = await request('', 'POST', { name: 'Copy', email: 'AMAYA@example.com', age: 30 });
  assert.equal(res.status, 409);
});

test('POST /api/users rejects malformed JSON', async () => {
  const res = await request('', 'POST', '{"name": "oops"');
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /Malformed JSON/);
});

test('PUT /api/users/:id replaces a user and requires all fields', async () => {
  const res = await request('/2', 'PUT', { name: 'Daniel F.', email: 'dan@example.com', age: 32 });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).age, 32);

  assert.equal((await request('/2', 'PUT', { name: 'Only name' })).status, 400);
  assert.equal((await request('/999', 'PUT', { name: 'Ghost', email: 'g@example.com', age: 40 })).status, 404);
});

test('PATCH /api/users/:id updates only the given fields', async () => {
  const res = await request('/3', 'PATCH', { age: 29 });
  assert.equal(res.status, 200);
  const user = await res.json();
  assert.equal(user.age, 29);
  assert.equal(user.name, 'Nimali Silva');

  assert.equal((await request('/3', 'PATCH', {})).status, 400);
  assert.equal((await request('/3', 'PATCH', { email: 'amaya@example.com' })).status, 409);
});

test('DELETE /api/users/:id deletes a user', async () => {
  assert.equal((await request('/1', 'DELETE')).status, 204);
  assert.equal((await request('/1')).status, 404);
  assert.equal((await request('/1', 'DELETE')).status, 404);
});

test('unknown routes return 404', async () => {
  const res = await fetch(baseUrl.replace('/api/users', '/api/nope'));
  assert.equal(res.status, 404);
});
