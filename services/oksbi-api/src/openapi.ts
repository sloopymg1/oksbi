export const openApiDocument = `openapi: 3.1.0
info:
  title: OKSBI API
  version: 0.1.0
servers:
  - url: http://localhost:7071
paths:
  /health:
    get:
      summary: Service health
  /auth/register:
    post:
      summary: Register a creator account
  /auth/login:
    post:
      summary: Authenticate a creator account
  /auth/me:
    get:
      summary: Resolve the current user
  /auth/logout:
    post:
      summary: Revoke the current session
  /onboarding:
    post:
      summary: Create or update onboarding state
  /releases:
    get:
      summary: List releases
  /recordings:
    get:
      summary: List recordings
  /compositions:
    get:
      summary: List compositions
  /rights/splits:
    post:
      summary: Submit split version
  /royalties/statements:
    get:
      summary: List royalty statements
  /payouts:
    post:
      summary: Create payout request
  /smart-links:
    post:
      summary: Create or update smart link
  /support/cases:
    post:
      summary: Create support case
  /takedowns:
    post:
      summary: Create takedown request
  /admin/operations:
    post:
      summary: Record admin operation
`;