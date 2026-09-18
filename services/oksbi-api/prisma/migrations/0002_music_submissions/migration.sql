CREATE TABLE music_submissions (
  id text PRIMARY KEY,
  owner_user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  metadata jsonb NOT NULL,
  artist_name text NOT NULL,
  audio_blob_path text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
  registrations jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_by text,
  updated_by text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);
CREATE INDEX music_submissions_owner_idx ON music_submissions(owner_user_id);
