import pool from '../db/pool.js';

// All queries use ? placeholders (parameterised queries), so user input is
// never pasted into the SQL string. This prevents SQL injection.

const SELECT_COLUMNS = `
  SELECT id, name, email, age, created_at AS createdAt, updated_at AS updatedAt
  FROM users`;

// Optional search matches name or email (LIKE, case-insensitive with the default collation).
export async function findAll(search = '') {
  if (!search) {
    const [rows] = await pool.query(`${SELECT_COLUMNS} ORDER BY id DESC`);
    return rows;
  }
  const pattern = `%${search.replace(/[\\%_]/g, '\\$&')}%`;
  const [rows] = await pool.query(
    `${SELECT_COLUMNS} WHERE name LIKE ? OR email LIKE ? ORDER BY id DESC`,
    [pattern, pattern]
  );
  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query(`${SELECT_COLUMNS} WHERE id = ?`, [id]);
  return rows[0] || null;
}

export async function create({ name, email, age }) {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
    [name, email, age]
  );
  return findById(result.insertId);
}

// Updates only the columns given in `changes` (keys are already validated
// to be name / email / age, so they're safe to use as column names).
export async function update(id, changes) {
  const columns = Object.keys(changes);
  const setClause = columns.map((column) => `${column} = ?`).join(', ');
  const values = columns.map((column) => changes[column]);

  const [result] = await pool.query(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, id]);
  if (result.affectedRows === 0) return null;
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

export async function ping() {
  await pool.query('SELECT 1');
}
