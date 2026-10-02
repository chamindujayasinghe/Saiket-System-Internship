// 404 for any route that doesn't exist.
export function notFound(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
}

// Central error handler: catches anything thrown in routes/controllers.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Malformed JSON body (thrown by express.json()).
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON in request body' });
  }

  console.error(err);
  res.status(err.status || 500).json({ error: err.status ? err.message : 'Internal server error' });
}
