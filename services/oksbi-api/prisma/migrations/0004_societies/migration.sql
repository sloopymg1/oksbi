CREATE TABLE societies (
  id text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  kind text NOT NULL CHECK (kind IN ('PRO', 'CMO', 'publisher')),
  region text NOT NULL,
  website text NOT NULL,
  description text NOT NULL,
  created_by text,
  updated_by text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);