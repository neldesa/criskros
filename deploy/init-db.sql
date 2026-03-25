-- Registrations table for provisional team sign-ups
CREATE TABLE IF NOT EXISTS registrations (
  id          SERIAL PRIMARY KEY,
  organization TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT NOT NULL,
  city         TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending',
  notes        TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);
