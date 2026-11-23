# Production readiness rollback drill

Slug: `production-readiness-rollback`
Created: 2026-11-22

## Goal

Define and verify a safe way to restore the last known-good static release without changing browser-local scenario data.

## Context

The project produces a static `dist/` artifact but has no durable rollback procedure, retained-artifact rule or automated rehearsal. A hosting provider has not been selected, so this change must stay provider-independent and must not claim that a production rollback was executed.

## Plan

- [x] Document the release identity, rollback trigger, artifact-retention rule and post-rollback checks
- [x] Add a local drill that deploys a simulated bad candidate and restores an immutable known-good artifact
- [x] Verify the restored artifact byte-for-byte and check the current localStorage schema boundary
- [x] Add the drill to the repository verification gate after the production build
- [x] Run the complete repository verification gate
- [x] Update and validate the production-readiness report with current rollback evidence
- [x] Review the resulting project diff

## Acceptance Criteria

- [x] The drill works only in an isolated temporary directory
- [x] The restored static artifact exactly matches the recorded known-good digest
- [x] The procedure explains that static-file rollback does not erase browser localStorage
- [x] The procedure stops rollback when a data-schema change is not backward compatible
- [x] The complete verification gate runs the rollback drill automatically
- [x] The report distinguishes the local rehearsal from a future provider-specific production rollback

## Files

- `docs/ROLLBACK.md`
- `scripts/verify-rollback.mjs`
- `package.json`
- `README.md`
- `docs/architecture.md`
- `FEATURES.md`
- `docs/production-readiness.html`
- `docs/tasks/production-readiness-rollback.md`

## Risks

- A source-code reset is not a deployment rollback, so the procedure must restore an already-built immutable artifact.
- A static-file rollback cannot reverse a future incompatible localStorage migration; the procedure must require a compatibility decision before switching versions.
- The local drill does not prove a hosting provider's rollback controls until a provider and target deployment exist.

## Product behavior register

`FEATURES.md` needs a tooling update because the required verification gate gains an automated rollback rehearsal. Runtime product behavior remains unchanged.

## Outcome

The verification gate now builds the production artifact, archives it as the known-good release, deploys a deliberately invalid candidate in a disposable directory and atomically restores the archive. The restored tree matched the recorded SHA-256 digest, schema version `1` remained compatible, and the complete gate passed with 29 unit tests and 38 browser tests. No provider or live environment was changed.
