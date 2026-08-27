CREATE TABLE IF NOT EXISTS chat_sessions (
  id                  TEXT PRIMARY KEY,
  created_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  last_seen_at        TEXT,
  locale              TEXT,
  landing_path        TEXT,
  posthog_distinct_id TEXT,
  ip_hash             TEXT,
  utm_source          TEXT,
  utm_medium          TEXT,
  utm_campaign        TEXT,
  lead_id             INTEGER
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  role       TEXT NOT NULL,
  content    TEXT NOT NULL,
  tool_name  TEXT
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id, id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_lead    ON chat_sessions(lead_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_ip      ON chat_sessions(ip_hash, created_at);
