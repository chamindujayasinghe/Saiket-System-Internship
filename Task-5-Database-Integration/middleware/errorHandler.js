// 404 for any route that doesn't exist.
export function notFound(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
}

// MySQL error codes that mean "the database can't be reached".
const DB_UNAVAILABLE = ['ECONNREFUSED', 'ER_ACCESS_DENIED_ERROR', 'ER_BAD_DB_ERROR', 'ER_NO_SUCH_TABLE', 'PROTOCOL_CONNECTION_LOST'];

// Central error handler: catches anything thrown in routes/controllers.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Malformed JSON body (thrown by express.json()).
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON in request body' });
  }

  // UNIQUE constraint on users.email.
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'A user with this email already exists' });
  }

  if (DB_UNAVAILABLE.includes(err.code)) {
    console.error(`Database error (${err.code}): ${err.message}`);
    return res.status(503).json({ error: 'Database unavailable. Check the server configuration.' });
  }

  console.error(err);
  res.status(err.status || 500).json({ error: err.status ? err.message : 'Internal server error' });
}
