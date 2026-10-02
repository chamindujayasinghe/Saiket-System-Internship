const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ALLOWED_FIELDS = ['name', 'email', 'age'];

// Rules for each field. Each returns an error message, or null when valid.
const rules = {
  name(value) {
    if (typeof value !== 'string' || !value.trim()) return 'name is required and must be a non-empty string';
    if (value.trim().length < 2 || value.trim().length > 100) return 'name must be between 2 and 100 characters';
    return null;
  },
  email(value) {
    if (typeof value !== 'string' || !value.trim()) return 'email is required and must be a string';
    if (!EMAIL_PATTERN.test(value.trim())) return 'email must be a valid email address';
    return null;
  },
  age(value) {
    if (!Number.isInteger(value)) return 'age is required and must be a whole number';
    if (value < 1 || value > 150) return 'age must be between 1 and 150';
    return null;
  },
};

/**
 * Builds a validation middleware.
 * @param {{ partial?: boolean }} options  partial = true for PATCH (only the fields sent are checked)
 */
export function validateUser({ partial = false } = {}) {
  return (req, res, next) => {
    const body = req.body;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ error: 'Request body must be a JSON object' });
    }

    const unknown = Object.keys(body).filter((key) => !ALLOWED_FIELDS.includes(key));
    const fieldsToCheck = partial ? ALLOWED_FIELDS.filter((f) => f in body) : ALLOWED_FIELDS;

    const details = [
      ...unknown.map((key) => `${key} is not an allowed field`),
      ...fieldsToCheck.map((field) => rules[field](body[field])).filter(Boolean),
    ];

    if (partial && fieldsToCheck.length === 0 && unknown.length === 0) {
      details.push(`provide at least one of: ${ALLOWED_FIELDS.join(', ')}`);
    }

    if (details.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details });
    }

    // Pass on clean, trimmed values only.
    req.validated = {};
    if ('name' in body) req.validated.name = body.name.trim();
    if ('email' in body) req.validated.email = body.email.trim().toLowerCase();
    if ('age' in body) req.validated.age = body.age;

    next();
  };
}

// Rejects ids that aren't positive whole numbers before they reach the controller.
export function validateId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'id must be a positive whole number' });
  }
  req.userId = id;
  next();
}
