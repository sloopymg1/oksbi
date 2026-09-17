# OKSBI Integration Handoff

## Backend
- Folder: `services/oksbi-api`
- Build: `npm --prefix services/oksbi-api run build`
- Run: `npm --prefix services/oksbi-api run start`
- Port: `3001` (`PORT`)
- Health: `GET /health`
- Auth: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`; protected domain routes require the auth boundary.

## Frontend
- Folder: `services/web`
- Build: `npm --prefix services/web run build`
- Dev: `npm --prefix services/web run dev`
- API seam: `services/web/src/api/index.ts`; replace the mock export with the live typed client method-for-method.
- Delete after wiring: `services/web/src/api/mockClient.ts`, `services/web/src/mocks/*`, duplicated local mock types, `services/web/src/api/previewState.ts`, and `services/web/src/components/PreviewStateToggle.vue`.

## API Routes
- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`
- `POST /onboarding`
- `GET /releases`
- `GET /recordings`
- `GET /compositions`
- `POST /rights/splits`
- `GET /royalties/statements`
- `POST /payouts`
- `POST /smart-links`
- `POST /support/cases`
- `POST /takedowns`
- `POST /admin/operations`
- `GET /openapi`

## Database
- Type: PostgreSQL
- Tool: Prisma migrations
- Migration directory: `services/oksbi-api/prisma/migrations`
- Connection: `DATABASE_URL`
- NO seed data is to be created.

## Azure Infrastructure
- Blob Storage: `BLOB_STORAGE_ACCOUNT_URL`, private media and documents
- Redis: `REDIS_URL`, sessions/rate limits/transient state
- Development provider selection: `AZURE_FUNCTIONS_ENVIRONMENT=Development`; production uses managed identity and resource endpoints.

## Shared Types
- Package/location: `services/shared`
- Build: `npm --prefix services/shared run build`
- Frontend API contract: `services/web/src/api/types.ts`
- Backend imports shared contracts from `services/shared/src`.

## Services
- Essential: PostgreSQL/database, authentication/session boundary, Blob Storage/private file access, Redis/session and rate-limit boundary.
- Enhancement: external DSP delivery, publishing/collection, Content ID, payment, email, and identity-verification provider adapters.

## Integration results

- Added schema-only PostgreSQL migration `services/oksbi-api/prisma/migrations/0001_initial/migration.sql` and the `npm run migrate` runner. Migration application is blocked on the local PostgreSQL instance rejecting the configured `postgres/postgres` password; no seed data was created.
- Backend build passes and the host starts on port 7071 from local settings. Every route responds without a runtime `500`: `/openapi` returns `200`, protected routes return structured `401` responses, and invalid auth payloads return structured `422` responses. `/health` returns `503` because PostgreSQL and Blob Storage are unavailable; Redis is healthy.
- Replaced the frontend mock client with `services/web/src/api/client.ts`, switched `services/web/src/api/index.ts` to the live client, added live read routes for rights, payouts, and support, and removed mock and preview-state files.
- Frontend production build passes. Nuxt proxies `/api/**` to the running backend at `http://localhost:7071`.
- End-to-end evidence: while both servers were running, `GET http://localhost:3000/api/openapi` returned `200` through the Nuxt proxy, and `GET http://localhost:3000/api/health` returned the backend's live `503` dependency report. Both servers were then stopped cleanly.
