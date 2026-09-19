# Project Plan

**Status**: Awaiting Integration
**Created**: 2026-09-18
**Mode**: AUGMENT

---

## 1. Project Overview

**Goal**: Extend the existing OKSBI music operations platform for authenticated creator onboarding, catalog distribution, publishing rights, royalty reporting, payouts, smart links, support, takedowns, and administrator workflows. The project is designed so that every module is independently testable.

**App Type**: Full-stack SSR

**API Login**: Yes

**Mode**: AUGMENT

**Deployment Plan**: No deployment plan found

---

## 2. Backend — Azure Functions

| Component | Technology |
|-----------|-----------|
| **Language** | TypeScript |
| **Runtime** | Node |
| **Package Manager** | npm |
| **Test Runner** | vitest |
| **Mocking Library** | vi.mock |
| **Test Command** | npm test |
| **Orchestration** | docker-compose |
| **Existing Service** | `services/oksbi-api` Node HTTP API with typed routes, provider adapters, and shared contracts |

The existing backend remains the source of truth for API behavior. PostgreSQL stores normalized creator, catalog, rights, and finance records; private media and identity documents use Blob Storage; Redis supports sessions, rate limits, and short-lived workflow state. External DSP, publishing, Content ID, payment, email, and identity integrations remain behind provider interfaces and deterministic test adapters.

---

## 3. Frontend — Web App

| Component | Technology |
|-----------|-----------|
| **Language** | TypeScript |
| **Framework** | Nuxt 4 |
| **Package Manager** | npm |
| **Test Runner** | vitest |
| **Mocking Library** | vi.mock |
| **Test Command** | npm test |

The existing `services/web` app uses Nuxt SSR, Vue, Tailwind via Vite, typed API access, and a responsive authenticated shell. The scaffold should preserve its route and component organization while introducing Vuetify 3 primitives where new screens require shared controls.

---

## 4. Services Required

| Azure Service | Role in App | Environment Variable | Default Value (Local) | Classification |
|---------------|------------|---------------------|----------------------|----------------|
| Blob Storage | Private audio masters, artwork, identity documents, contracts, royalty files, and exports | `BLOB_STORAGE_ACCOUNT_URL` | `http://127.0.0.1:10000/devstoreaccount1` | Essential |
| PostgreSQL | Normalized system of record for creators, catalog, rights, royalties, payouts, support, and audit facts | `DATABASE_URL` | `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5433/${POSTGRES_DB}` | Essential |
| Redis | Opaque sessions, rate limits, one-time tokens, short-lived locks, and bounded caches | `REDIS_URL` | `redis://localhost:6379` | Essential |

---

## 5. Prerequisites

### Run

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Node.js | * | ✅ | v24.11.0 |
| npm | * | ✅ | 11.6.2 |

### Debug

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Docker | oksbi-api, oksbi-web | ✅ | 27.4.0 |
| Docker Compose | oksbi-api, oksbi-web | ✅ | v2.29.7-desktop.1 |
| Chrome | oksbi-web | ✅ | macOS application detected |
| Azure Functions Core Tools | oksbi-api | ❓ | Could not be confirmed; existing backend currently runs as a Node HTTP service |
| `ms-azuretools.vscode-azurefunctions` | oksbi-api | ❓ | Extension folder not found by filesystem scan |

Double-check every ❓ prerequisite before enabling local debugging or changing the backend host model.

---

## 6. Design System & UI

**Component Library**: Vuetify 3
**Style Direction**: A focused music-operations workspace with dark ink, warm paper, signal coral, and mint status accents. Keep repeated operational work dense and scannable, while giving catalog and release surfaces a more editorial media treatment.
**Typography**: Manrope, system-ui, -apple-system, sans-serif

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#D95D39` | Coral actions, active navigation, release submission and payout CTAs |
| `accent` | `#55B79A` | Rights-cleared, paid, verified, and healthy status highlights |
| `surface` | `#F6F0E8` | Warm paper workspace and page background |
| `text` | `#18232B` | Dense catalog, finance, and rights copy |
| `muted` | `#6B7775` | Timestamps, helper copy, provider metadata, and secondary labels |
| `border` | `#D9D5CC` | Tables, form fields, dividers, and workflow boundaries |

### Pages

| Page | Route | Purpose | Layout |
|------|-------|---------|--------|
| Creator Dashboard | `/` | Surface release readiness, royalty movement, and next actions for the signed-in creator. | `header + sidebar + hero + grid + table + actions` |
| Catalog | `/catalog` | Review releases and recordings across delivery and approval states. | `header + sidebar + actions + tabs + table + card-list` |
| Rights Review | `/rights` | Compare composition splits, ownership participants, and pending approvals. | `header + sidebar + action-bar + two-column(table+card-list) + tabs` |
| Royalty Statements | `/royalties` | Inspect statement periods, net earnings, and reconciliation status. | `header + sidebar + hero + table + card-list + actions` |
| Payout Center | `/payouts` | Track available balance and submit or review payout requests. | `header + sidebar + hero + two-column(card-list+form) + table` |
| Sign In | `/login` | Authenticate a creator or administrator before entering the workspace. | `header + main + form + actions + footer` |

### Sample Content

Creator Dashboard — creator workspace:
| Metric | Value | Context | Status |
|--------|-------|---------|--------|
| Releases live | 12 | Across 7 DSP territories | On track |
| Pending rights reviews | 3 | Split versions awaiting approval | Needs review |
| Available to withdraw | `$4,286.17` | Cleared royalty balance | Ready |

Catalog — release:
| Release | Format | Delivery | Updated | Status |
|---------|--------|----------|---------|--------|
| Night Transit | 10-track album | 18 DSPs | 18 Sep 2026 | Live |
| Glass Hours | 4-track EP | 12 DSPs | 15 Sep 2026 | Processing |
| Soft Signal | Single | Metadata review | 12 Sep 2026 | Action needed |

Rights Review — split version:
| Composition | Contributors | Creator share | Review state |
|-------------|--------------|---------------|--------------|
| Glass Hours | A. Okafor, M. Vale | 60% | Awaiting publisher |
| Night Transit | A. Okafor, L. Chen | 50% | Approved |
| Soft Signal | A. Okafor, R. Ellis | 75% | Needs revision |

Royalty Statements — statement:
| Period | Source | Net amount | Reconciliation |
|--------|--------|------------|----------------|
| Q2 2026 | DSP collection | `$1,842.63` | Reconciled |
| Q1 2026 | DSP collection | `$1,106.28` | Reconciled |
| Q4 2025 | Publishing | `$724.91` | Review note |

Payout Center — request:
| Request | Amount | Submitted | State |
|---------|--------|-----------|-------|
| PO-1048 | `$2,000.00` | 16 Sep 2026 | Pending approval |
| PO-1032 | `$1,250.00` | 21 Aug 2026 | Paid |
| PO-0987 | `$860.00` | 09 Jun 2026 | Paid |

Sign In — fields: Email: `creator@oksbi.test` · Remember device: `Off`

---

## 7. Project Structure

```
oksbi/
├── .azure/project-plan.md
├── docker-compose.yml
├── api-test-collections/oksbi-api/
├── services/
│   ├── oksbi-api/
│   │   ├── src/routes/              # HTTP route modules
│   │   ├── src/services/            # domain, infrastructure, provider ports
│   │   ├── prisma/migrations/       # schema-only migrations
│   │   └── openapi.yaml
│   ├── web/
│   │   ├── src/pages/               # SSR route screens
│   │   ├── src/components/          # shell and state primitives
│   │   ├── src/api/                 # typed API client and resource composables
│   │   └── src/assets/css/          # Tailwind and theme tokens
│   └── shared/
│       └── src/{schemas,types}/     # Zod schemas and shared API/entity contracts
└── tsconfig.base.json
```

---

## 8. Route Definitions

| # | Method | Path | Description | Request Body | Response Body | Status Codes |
|---|--------|------|-------------|-------------|--------------|-------------|
| 1 | GET | `/api/health` | Report API and dependency health | — | `{ status, services }` | 200, 503 |
| 2 | POST | `/api/auth/register` | Register a creator account | `{ email, password, displayName }` | `{ user, session }` | 201, 409, 422 |
| 3 | POST | `/api/auth/login` | Authenticate a creator account | `{ email, password }` | `{ user, session }` | 200, 401, 422 |
| 4 | GET | `/api/auth/me` | Resolve the current signed-in user | — | `{ user }` | 200, 401 |
| 5 | POST | `/api/auth/logout` | Revoke the current session | — | `{ success }` | 204, 401 |
| 6 | POST | `/api/onboarding` | Create or update creator onboarding state | `{ profile, documents }` | `{ onboarding }` | 200, 401, 422 |
| 7 | GET | `/api/releases` | List releases for the signed-in creator | — | `{ releases }` | 200, 401 |
| 8 | GET | `/api/recordings` | List recordings, optionally filtered by release | `?releaseId=` | `{ recordings }` | 200, 401 |
| 9 | GET | `/api/compositions` | List compositions for the signed-in creator | — | `{ compositions }` | 200, 401 |
| 10 | POST | `/api/rights/splits` | Submit a split version for review | `{ compositionId, contributors, shares }` | `{ splitVersion }` | 201, 401, 409, 422 |
| 11 | GET | `/api/royalties/statements` | List royalty statements and reconciliation state | `?period=` | `{ statements }` | 200, 401 |
| 12 | POST | `/api/payouts` | Create a payout request | `{ amount, destinationId }` | `{ payout }` | 201, 401, 422, 409 |
| 13 | POST | `/api/smart-links` | Create or update a release smart link | `{ releaseId, destinations }` | `{ smartLink }` | 200, 401, 422 |
| 14 | POST | `/api/support/cases` | Create a support case | `{ subject, category, message }` | `{ case }` | 201, 401, 422 |
| 15 | POST | `/api/takedowns` | Submit a copyright or takedown request | `{ releaseId, reason, evidence }` | `{ takedown }` | 201, 401, 403, 422 |
| 16 | POST | `/api/admin/operations` | Record an authorized admin operation | `{ operation, targetId, metadata }` | `{ operation }` | 201, 401, 403, 422 |
| 17 | GET | `/api/openapi` | Fetch the OpenAPI document | — | OpenAPI 3.1 document | 200 |

---

## 9. Next Steps

1. Run **azure-project-scaffold** to execute this plan
2. Run **azure-project-integrate** to wire the frontend to live data, smoke-test the backend, and create the migrations
3. Run **azure-debug-plan** → **azure-debug-generate** for Docker emulators and VS Code debugging
4. Run the **azure-deploy** agent when ready; it uses **azure-app-onboard** for architecture, cost estimation, IaC generation, provisioning, and health verification