CREATE TABLE users (
  id text PRIMARY KEY,
  email text NOT NULL UNIQUE,
  display_name text NOT NULL,
  roles text[] NOT NULL DEFAULT ARRAY['creator']::text[],
  organization_id text,
  onboarding_completed boolean NOT NULL DEFAULT false,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE sessions (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE onboarding_profiles (
  id text PRIMARY KEY,
  user_id text NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  organization_name text NOT NULL,
  artist_name text NOT NULL,
  country_code text NOT NULL,
  tax_residence_country text NOT NULL,
  status text NOT NULL CHECK (status IN ('draft', 'submitted', 'approved')),
  created_by text,
  updated_by text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE releases (
  id text PRIMARY KEY,
  owner_user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  upc text UNIQUE,
  artwork_blob_path text,
  release_date date NOT NULL,
  status text NOT NULL CHECK (status IN ('draft', 'review', 'scheduled', 'released')),
  created_by text,
  updated_by text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE recordings (
  id text PRIMARY KEY,
  release_id text NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  title text NOT NULL,
  isrc text UNIQUE,
  duration_seconds integer NOT NULL CHECK (duration_seconds >= 0),
  explicit boolean NOT NULL DEFAULT false,
  created_by text,
  updated_by text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE compositions (
  id text PRIMARY KEY,
  owner_user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  iswc text UNIQUE,
  publisher_name text,
  status text NOT NULL CHECK (status IN ('draft', 'registered', 'disputed')),
  created_by text,
  updated_by text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE rights_splits (
  id text PRIMARY KEY,
  composition_id text NOT NULL REFERENCES compositions(id) ON DELETE CASCADE,
  version_name text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending_review', 'approved', 'rejected')),
  interests jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_by text,
  updated_by text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE royalty_statements (
  id text PRIMARY KEY,
  organization_id text NOT NULL,
  statement_month date NOT NULL,
  currency_code varchar(3) NOT NULL,
  gross_amount numeric(19, 4) NOT NULL,
  net_amount numeric(19, 4) NOT NULL,
  status text NOT NULL CHECK (status IN ('processing', 'available', 'reconciled')),
  created_by text,
  updated_by text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  UNIQUE (organization_id, statement_month)
);

CREATE TABLE payout_requests (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount numeric(19, 4) NOT NULL CHECK (amount > 0),
  currency_code varchar(3) NOT NULL,
  destination_label text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
  created_by text,
  updated_by text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE smart_links (
  id text PRIMARY KEY,
  release_id text NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  destinations jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_by text,
  updated_by text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE support_cases (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('general', 'royalties', 'rights', 'distribution')),
  subject text NOT NULL,
  description text NOT NULL,
  status text NOT NULL CHECK (status IN ('open', 'in_review', 'resolved')),
  created_by text,
  updated_by text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE takedown_requests (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('recording', 'release', 'smart_link')),
  target_id text NOT NULL,
  reason text NOT NULL,
  status text NOT NULL CHECK (status IN ('submitted', 'under_review', 'completed')),
  created_by text,
  updated_by text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE admin_operations (
  id text PRIMARY KEY,
  actor_user_id text NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  operation_type text NOT NULL CHECK (operation_type IN ('grant_role', 'ledger_adjustment', 'provider_retry', 'account_lock')),
  target_id text NOT NULL,
  notes text,
  created_by text,
  updated_by text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);


CREATE INDEX sessions_user_id_idx ON sessions(user_id);
CREATE INDEX sessions_expires_at_idx ON sessions(expires_at);
CREATE INDEX releases_owner_user_id_idx ON releases(owner_user_id);
CREATE INDEX releases_release_date_idx ON releases(release_date DESC);
CREATE INDEX recordings_release_id_idx ON recordings(release_id);
CREATE INDEX compositions_owner_user_id_idx ON compositions(owner_user_id);
CREATE INDEX rights_splits_composition_id_idx ON rights_splits(composition_id);
CREATE INDEX royalty_statements_organization_id_idx ON royalty_statements(organization_id);
CREATE INDEX payout_requests_user_id_idx ON payout_requests(user_id);
CREATE INDEX smart_links_release_id_idx ON smart_links(release_id);
CREATE INDEX support_cases_user_id_idx ON support_cases(user_id);
CREATE INDEX takedown_requests_user_id_idx ON takedown_requests(user_id);
CREATE INDEX admin_operations_actor_user_id_idx ON admin_operations(actor_user_id);
