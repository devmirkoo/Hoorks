export const SQL_SCHEMA = `
CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY,
  key_hash TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  revoked INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  gamepass_id TEXT,
  is_a_gift INTEGER DEFAULT 0,
  gifter_id TEXT,
  amount REAL NOT NULL,
  universe_id TEXT NOT NULL,
  place_id TEXT NOT NULL,
  transaction_id TEXT UNIQUE NOT NULL,
  timestamp TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`;
