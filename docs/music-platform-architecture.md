# OKSBI distribution and publishing integration architecture

Status: proposed integration design, checked against official sources on 2026-09-18. External adapters described below are not implemented or connected. Provider selection and launch region remain open.

## Product boundary

OKSBI membership lets musicians submit recordings and work metadata to OKSBI. It does not automatically establish membership with a society, grant a publishing administration mandate, deliver a recording to a DSP, or confirm a work registration.

Keep four independently observable processes:

| Process | Input | Completion evidence |
| --- | --- | --- |
| Distribution | Release, audio, artwork, recording metadata, territories and release terms | Provider acknowledgement followed by store-specific availability |
| Publishing administration | Musical work, interested parties, affiliations, rights/territory mandates and registration metadata | Society acknowledgement and work reference |
| Audience analytics | Recording/artist identifiers and licensed analytics feeds | Dated observations with source and coverage |
| Royalty accounting | Distributor/society statements, agreements and settlement evidence | Reconciled accounting entries; payment confirmation is a separate event |

## Verified corrections to the initial provider outline

- DDEX ERN communicates releases, resources and availability terms. It supports cloud-storage and web-service exchange choreography. OKSBI need not build ERN itself when a contracted distributor accepts its own API input; that depends on the provider contract. Direct implementation requires a DDEX implementation licence and partner-specific delivery requirements. [DDEX ERN](https://ddex.net/standards/electronic-release-notification-message-suite/)
- CISAC CWR is a musical-work registration format; it also supports registration-status communication. CRD concerns royalty distribution reporting. Do not assume every society offers a public REST or XML endpoint. [CISAC formats](https://www.cisac.org/formats)
- Soundcharts documents artist/song, audience, chart and playlist data. Use this as an optional analytics source, not evidence of money owed or received. Any revenue estimate must be labelled separately from statement earnings. [Soundcharts developer portal](https://developers.soundcharts.com/)
- MatchTune currently describes music-use detection and audit capabilities; this does not establish a society-registration service. The provided Musiio URL redirects to SoundCloud. Neither is a verified publishing-registration connector for OKSBI. [MatchTune](https://www.matchtune.com/) · [Musiio URL](https://musiio.com/)
- The DDEX sales/usage-reporting family is DSR. The supplied claim that Boomplay uses “DDEX DSG,” a particular monthly delivery schedule, or a particular count of regional charts has not been verified. Obtain the actual distributor statement samples and contracted analytics coverage before promising these features. [DDEX DSR introduction](https://dsr8.ddex.net/digital-sales-report-message-suite%3A-part-8-record-type-definitions/1-introduction/)
- ISRC identifies a recording. Allocation can be performed by a registrant under an agency-issued prefix, or through a qualified provider; an external registry API is not universally required. Preserve existing recording identifiers. [IFPI ISRC](https://isrc.ifpi.org/)
- ISWC identifies a musical work and is assigned through authorized agency processes. Publisher access to the allocation service requires society authorization. Store pending identifiers and later resolution; never generate invented ISWCs. [ISWC allocation](https://www.iswc.org/get-iswc)

## Provider selection

Recommendation: evaluate a white-label distribution partner for the first delivery integration. This reduces the initial scope to OKSBI's musician experience, catalog quality, provider mapping and operational reconciliation. This is an engineering recommendation, not a vendor commitment.

| Candidate | Evidence | Required evaluation |
| --- | --- | --- |
| EVEARA | Offers B2B white-label distribution, reporting and payout features | Contract, developer documentation, sandbox, current Boomplay coverage, fees, statement access and callback semantics |
| SonoSuite | Advertises white-label distribution, royalty management and API access | Minimum catalog/account requirements, API scope, sandbox, delivery coverage and accounting exports |
| FUGA | Offers music distribution services | Commercial eligibility, contracted API access, deliverable formats, supported territories and statement feeds |

Sources: [EVEARA](https://eveara.com/) · [SonoSuite](https://sonosuite.com/) · [FUGA](https://fuga.com/).

Choose the publishing region separately from global DSP coverage. For each society, confirm repertoire eligibility, representation/mandate requirements, supported rights and territories, accepted file/API version, secure transfer method and acknowledgement format. Do not advertise an entered society name as a connected partner.

## Catalog and rights model to implement

Use internal identifiers even before external identifiers exist:

- `Release`: product metadata, UPC, dates, artwork, territories and recording sequence.
- `Recording`: master asset, artists, duration, explicit flag, ISRC and ownership.
- `MusicalWork`: composition, alternate titles, language, ISWC and interested parties.
- `RecordingWorkLink`: explicit recording-to-work mapping, provenance and verification state. Permit multiple recordings of a work and multiple works within a recording; avoid a globally one-to-one ISRC/ISWC assumption.
- `ExternalIdentifier`: provider, identifier type/value, local entity, source and resolution state.
- `RightsAgreement`: rights category, party, territory, validity dates, collection authority and supporting evidence.
- `SplitVersion`: effective dates, approvals and allocation scope. Recording income and composition income need separate splits; an intake writer total of 100% is not by itself a society-specific collection-share model.

Existing `music_submissions.metadata` captures intake. A future approval transaction should normalize approved submissions into the catalog entities and retain the immutable intake version. The current recording and composition tables are not linked to this intake yet.

## Adapter and delivery boundaries

Design separate `DistributionProvider`, `PublishingProvider`, `RoyaltyStatementProvider` and optional `AudienceAnalyticsProvider` interfaces. Avoid provider-specific fields in musician forms.

Persist integration accounts and capability states (`not_configured`, `sandbox`, `live`) without storing credentials in browser data. Keep secret references server-side.

For each outbound action, store the local entity/version, provider account, payload hash, idempotency key, destination, attempt count, next retry, acknowledgement ID and error. Use a durable outbox and worker; HTTP acceptance should not wait for society or DSP delivery.

Maintain immutable delivery events and verify callback authenticity according to the selected provider's documented mechanism. Deduplicate event IDs, handle out-of-order events, back off transient failures, and retain a manual recovery queue. Poll when callbacks are unavailable.

Proposed distinct state machines:

- Distribution: draft → review → queued → sent → provider accepted → live per DSP; rejected and takedown states remain explicit.
- Publishing: draft → review → queued → sent → acknowledged → registered per society/right/territory; preserve conflicts and corrections.
- Statements: received → validated → matched → reconciled → posted; unmatched rows remain pending.

“Sent” needs delivery evidence. “Registered” needs society evidence. “Live” needs store/provider evidence. These are not interchangeable successes.

## Royalty ingestion and split accounting

This is a proposed engineering model; commercial fee and settlement rules must come from OKSBI's agreements.

1. Retain original statement bytes privately, checksum, provider account, reporting period, import version and source currency. Make import retries idempotent.
2. Normalize line items with source row ID, DSP/society, territory, usage period, right type, recording/work identifiers, quantity and reported amount. Quarantine unmatched or ambiguous records instead of assigning them to the current user.
3. Preserve whether the source amount is gross or already net. Itemize reported deductions and contractual OKSBI fees to avoid charging a distributor deduction twice. Label unavailable upstream gross as unknown.
4. Use decimal strings and fixed-precision database arithmetic. Preserve fractional source amounts until the defined rounding step. Never use JavaScript binary floating-point for payable calculations.
5. Preserve source currency; record any conversion rate, source, date, precision and settlement currency. Do not add currencies together without explicit conversion.
6. Apply the appropriate approved split version for the usage/agreement period. Define deterministic remainder handling so allocated amounts exactly reconcile. Missing agreements, disputes and incomplete approvals hold posting or payment.
7. Separate reported earnings, reconciled earnings, cleared funds, reserves, payable balances and paid amounts. Record reversals as new entries linked to their originals.
8. Authorize every statement, balance and payout by entitled party/organization. Payout requests cannot create spendable funds; reserve balances transactionally and deduplicate payment submissions.

## Repository gaps and delivery order

| Phase | Work | Acceptance evidence |
| --- | --- | --- |
| Existing intake | Profile, private upload, writer shares, requested societies, manual status updates and support | Current workflow tests and production build |
| Catalog foundation | Normalize approved intake, recording/work links, separate rights agreements and split versions | Ownership/isolation tests; pending identifiers supported without fabrication |
| First publishing partner | Approved society profile, required mandate capture, validated exports/API adapter and acknowledgements | Partner-approved test work and correlated confirmation |
| First distributor | One contracted sandbox adapter, release validation, durable delivery jobs and callbacks/polling | Sandbox acceptance, duplicate retry test, store-status evidence |
| Royalty accounting | Statement import, matching queue, fee policy, split allocation, reconciliation and ledger-backed balances | Sample statements reconcile; duplicate imports and mixed currencies cannot inflate balances |
| Optional analytics | Licensed metrics and identifier resolution | Source/timestamp shown; estimates cannot enter payable ledger |

Current limits: no external provider adapters, delivery queue, automatic identifier allocation, statement ingestion or ledger-backed payout calculation are implemented. Current royalty endpoints are read views, not a completed accounting system. The existing royalty service's organization authorization and payout balance enforcement must be corrected before production financial data or payouts are enabled. Current music status changes are manual and do not retain a separate immutable event history.

## Decisions still needed

- White-label partner versus direct DDEX delivery; obtain actual API documentation and sandbox credentials after selection.
- First publishing territory and society relationships; Ghana/Africa-first is an option, not an assumed commitment.
- Which rights OKSBI will administer, applicable fee agreements, payout currencies and approved split/rounding policies.

No external provider has been contacted, selected, purchased or connected by this design update.
