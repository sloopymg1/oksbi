# OKSBI Project Plan

**Status**: Integrated
**Created**: 2026-09-17
**Mode**: Standard

## 1. Project Overview

OKSBI is a production-grade music platform for distribution, publishing administration, rights management, royalty reporting, payouts, smart links, Content ID workflows, support, copyright and takedown operations, and separate administrative operations.

The first delivery establishes a secure Nuxt 4 and TypeScript foundation, server-side application boundaries, authenticated onboarding, and a normalized creator-rights-finance domain model. The implementation is database-first: recordings and distribution remain separate from compositions and publishing, while rights, splits, royalty ledger entries, and payouts remain auditable and independently traceable.

## 2. Architecture

The application is a Nuxt 4 TypeScript web platform using SSR and server routes. Browser clients interact with server-owned routes and services; privileged operations never depend on client-provided authorization decisions. Domain modules expose application services around creators, releases, recordings, compositions, publishing, rights, splits, royalties, payouts, support, and administration.

The persistence boundary is PostgreSQL accessed through Prisma migrations and a normalized relational model. Private audio, identity documents, artwork, and supporting files are stored in private Blob Storage through signed, short-lived access flows. Redis provides session and transient infrastructure such as rate-limit counters, short-lived workflow state, and cache entries where appropriate.

External DSP, collection society, Content ID, payment, email, and identity integrations are represented behind provider interfaces. Initial development uses deterministic mocks or adapters so domain workflows and audit behavior can be tested without external agreements or credentials.

## 3. Services

| Service | Technology | Responsibility |
| --- | --- | --- |
| OKSBI platform | Nuxt 4, Vue, TypeScript, SSR, server routes | Authenticated creator and administrator workflows, dashboards, onboarding, catalog, rights, royalties, payouts, support, smart links, and operational UI |
| Domain application layer | Nuxt server services and typed modules | Authorization-aware use cases, validation, transactions, provider orchestration, audit events, and idempotency |
| Persistence layer | Prisma and PostgreSQL | Normalized records, immutable financial facts, ownership history, workflow state, and relational constraints |
| File access layer | Azure Blob Storage adapter | Private media and identity-document storage, metadata, quarantine/validation hooks, and signed delivery URLs |
| Transient infrastructure | Redis adapter | Sessions, rate limiting, short-lived locks/workflow state, and bounded caching |

## 4. Data Stores

### PostgreSQL

Use PostgreSQL as the system of record. Separate the recording and distribution model from the composition and publishing model. Core areas include users and organizations, creator profiles, releases, recordings, assets, territories, delivery packages, compositions, publishers, agreements, rights claims, ownership interests, split versions, royalty statements, ledger entries, reserves and adjustments, payout accounts, payout requests, support cases, takedowns, provider jobs, and audit events.

Financial and rights records must be append-oriented and auditable. Preserve source statements, effective dates, calculation inputs, currency and territory context, immutable ledger postings, approval history, and actor metadata. Enforce foreign keys, uniqueness, status transitions, decimal-safe monetary values, and idempotency keys at the database or transaction boundary.

### Blob Storage

Keep audio masters, artwork, identity documents, contracts, royalty source files, and generated exports private. Store only metadata and object references in PostgreSQL. Use server-mediated uploads, content validation, scoped object keys, short-lived signed URLs, and explicit authorization checks for download and deletion.

### Redis

Use Redis for opaque session records or session support, rate-limit buckets, one-time tokens, short-lived locks, background-job coordination, and narrowly scoped cache entries. PostgreSQL remains authoritative for durable security, rights, and finance state.

## 5. API & Integration

Define typed server routes and application services for authentication, onboarding, catalog and releases, distribution, compositions and publishing, rights and splits, royalty ingestion and reporting, payout workflows, smart links, Content ID, support, copyright/takedown, and administration.

Every mutating endpoint validates input server-side, checks tenant and role permissions, emits audit data, and supports idempotency where retries can create financial, rights, delivery, or provider side effects. Provider ports cover DSP delivery, publishing/collection, Content ID, payments, email, and identity verification. Adapters expose normalized results, provider job identifiers, retry state, and failure details without leaking provider-specific assumptions into domain tables.

The staged delivery is:

1. Foundation: Nuxt configuration, Tailwind via Vite, three-mode color mode, Prisma/PostgreSQL setup, Blob and Redis adapters, configuration validation, logging, and test seams.
2. Identity and onboarding: secure opaque sessions, email verification, MFA and step-up authentication, RBAC, CSRF defenses, rate limiting, audit events, creator and organization onboarding, and private document handling.
3. Rights-first catalog: normalized creators, releases, recordings, compositions, publishers, agreements, rights claims, ownership interests, versioned splits, and approval workflows.
4. Finance and operations: royalty imports, auditable ledger and reporting, reserves and adjustments, payout accounts and approval flow, distribution/provider jobs, smart links, support, Content ID, copyright, and takedown workflows.
5. Hardening: provider contract tests, migration tests, authorization matrix tests, reconciliation checks, observability, operational runbooks, and production readiness review.

## 6. Design System & UI

**Component Library**: Nuxt UI with Tailwind CSS via Vite
**Visual Direction**: A focused music-operations workspace with dark ink, warm paper, signal coral, and mint status accents. Use dense, scannable data views for repeated operational work and reserve expressive media treatment for catalog and release surfaces.
**Layout**: Responsive authenticated shell with role-aware navigation, workspace switcher, global search, contextual breadcrumbs, and persistent status/notification treatment. Use tables, step flows, timelines, filters, and drawers for operational workflows rather than decorative card grids.
**Core Screens**: Secure sign-in and verification, creator onboarding, creator dashboard, release and recording workspace, composition and publishing workspace, rights and split review, royalty statements and ledger, payout center, smart-link manager, support and takedown cases, and admin operations.
**Interaction States**: Every workflow includes loading, empty, validation, permission-denied, pending-review, provider-processing, reconciliation-warning, success, and recoverable-error states. Financial and rights changes show effective dates, audit history, approval state, and actor context.

## 7. Security & Compliance

Use server-side authorization as the source of truth. Implement opaque server-managed sessions, secure cookies, email verification, MFA and step-up authentication for sensitive actions, RBAC, CSRF protection, rate limiting, strict input validation, safe file handling, and security-focused headers. Keep secrets in environment-backed configuration and never expose provider credentials or private object paths to the client.

Partition data by user, organization, and role. Require explicit authorization for media, identity documents, contracts, royalty files, payout data, and administrative actions. Record immutable audit events for authentication, permission changes, rights and split edits, release submissions, provider actions, ledger adjustments, payout approvals, exports, and takedowns. Apply retention, deletion, and export policies to identity and financial data without compromising ledger traceability.

## 8. Delivery & Validation

Build migrations and domain invariants before feature screens. Validate each stage with Prisma migration checks, unit tests for domain calculations and transitions, integration tests for transactional workflows, authorization matrix tests, provider contract tests against mocks, private Blob access tests, Redis expiry/rate-limit tests, and end-to-end smoke tests for onboarding, catalog submission, rights approval, royalty reporting, and payout approval.

Deployment readiness requires environment validation, migration safety, structured logs, correlation and audit identifiers, health checks, retry and dead-letter behavior for provider jobs, reconciliation reports, backup and restore verification, and documented operational escalation paths. No external provider integration is considered production-ready until its adapter, failure modes, idempotency behavior, and reconciliation path are tested.