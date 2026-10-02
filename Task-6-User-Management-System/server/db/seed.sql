-- Sample users. INSERT IGNORE skips rows whose email already exists,
-- so this file is safe to run more than once.
INSERT IGNORE INTO users (name, email, age) VALUES
  ('Amaya Perera',      'amaya@example.com',   24),
  ('Daniel Fernando',   'daniel@example.com',  31),
  ('Nimali Silva',      'nimali@example.com',  28),
  ('Kasun Wickramasinghe', 'kasun@example.com', 35),
  ('Tharushi Bandara',  'tharushi@example.com', 22),
  ('Ravindu Herath',    'ravindu@example.com', 27);
