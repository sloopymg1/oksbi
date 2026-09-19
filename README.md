# OKSBI

Musicians register with OKSBI, complete a musician profile, and upload music for review and requested PRO/CMO registration.

## Music registration workflow

1. Create an account with a password of at least 12 characters.
2. Complete `/membership` with artist name, organization/independent status and country details.
3. Use `/catalog` to provide track details, optional ISRC/ISWC and publisher, writers and ownership shares totaling 100%, optional IPI and society affiliation, and requested societies/territories.
4. Confirm submission authority and upload WAV, MP3 or FLAC audio (maximum 50 MB). Drafts survive upload failures and can be resumed.
5. Submit to OKSBI. Each requested destination starts as `pending_review`.
6. Administrators review submissions, export metadata and manually record `needs_changes`, `sent`, or `registered`. Registration requires a previous delivery record and a society confirmation reference. Creators can send correction details through the rights support form.

Society names are requested destinations, not a directory of connected partners. This implementation does **not** transmit music to external societies. Live delivery requires society agreements, credentials, format mapping and connectors or a separate manual delivery process. Audio is stored in the private `music-masters` blob container; metadata exports are JSON review packages, not society-specific delivery files. Audio validation checks size and file signatures; it does not decode the full recording.

## Development

- `npm run build` builds all workspaces.
- `npm run typecheck --workspace=@oksbi/shared` and `npm run typecheck --workspace=oksbi-api` check backend types. The web workspace currently has no typecheck script; its production build validates compilation.
- `node --import tsx --test services/oksbi-api/tests/music.test.ts` tests ownership checks, validation and registration transitions using in-memory service doubles.
- From `services/oksbi-api`, run `node --env-file=../../.env scripts/migrate.mjs` against the configured development database. The runner applies all unapplied migrations in order, including `0002_music_submissions`.

## Integration architecture

See [the distribution and publishing architecture](docs/music-platform-architecture.md) for verified provider roles, catalog mapping, society registration, royalty accounting, implementation phases and open partner decisions. This document distinguishes the existing intake workflow from planned external integrations.

## Organization directory

The music submission form offers grouped selections for publishing companies, PROs and CMOs through authenticated `GET /music/organizations`. Maintain entries in `services/shared/src/organizations.ts`; each has a stable ID, name, category, region, description and official source link (checked 2026-09-18). New submissions must use valid directory IDs with matching names and categories, and duplicate organizations are rejected. Historical free-text drafts remain supported when completing submission.

The initial directory includes GHAMRO, CAPASSO, SAMRO, BMI, Sony Music Publishing and GHMusic Publishing and Management. These are selectable review destinations, not claims of OKSBI partnership or automatic acceptance. Publisher selection requests a publishing review and does not set the musician's existing publisher affiliation. No database migration is needed because destination details are stored in existing JSON metadata.
