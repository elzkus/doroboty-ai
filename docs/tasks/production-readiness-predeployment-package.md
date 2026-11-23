# Production readiness pre-deployment package

Slug: `production-readiness-predeployment-package`
Created: 2026-11-22

## Goal

Complete every useful preparation step that does not require selecting a hosting provider, creating an external account, spending money or naming a human incident owner.

## Context

The preparation report has six open mandatory items. Hosting, expected traffic/costs, incident ownership and delivered monitoring require human or provider decisions. The repository can still make the release artifact identifiable and verifiable, limit accidental asset growth, prepare operational procedures and reduce initial route loading before those decisions are made.

## Plan

- [x] Record scope and acceptance criteria before editing
- [x] Create and verify a release manifest for the exact static artifact
- [x] Add a regression budget for static assets without presenting it as capacity proof
- [x] Document repeatable release steps and provider handoff fields
- [x] Document incident diagnosis, recovery and participant communication
- [x] Document privacy-safe monitoring requirements and a test procedure
- [x] Split route modules so the first page does not load every workspace screen
- [x] Update the behavior register where runtime loading changes
- [x] Run the complete repository verification gate
- [x] Perform a separate review pass
- [x] Refresh and validate the production-readiness report

## Acceptance Criteria

- [x] A release candidate records source identity, lockfile digest, storage schema and per-file hashes
- [x] Verification fails when artifact bytes or manifest identity do not match
- [x] The full quality gate exercises manifest creation and verification
- [x] The initial route no longer requires the previous single 654 kB JavaScript chunk
- [x] Operational documentation clearly separates prepared procedure from verified production behavior
- [x] No external account, deployment, paid service or real-user data is created
- [x] Remaining human decisions have concrete fields and evidence requirements
- [x] `./scripts/verify` passes and actual results are recorded

## Files

- `scripts/release-artifact.mjs`
- `package.json`
- `src/features/prototype/app.tsx`
- `src/features/prototype/shell.tsx`
- `docs/RELEASE.md`
- `docs/INCIDENT_RESPONSE.md`
- `docs/CAPACITY.md`
- `docs/MONITORING.md`
- `README.md`
- `docs/architecture.md`
- `FEATURES.md`
- `docs/production-readiness.html`

## Risks

- A local artifact manifest cannot prove which bytes a future hosting provider serves.
- An engineering asset budget is a regression guard, not evidence that an unknown traffic level or hosting plan is sufficient.
- Monitoring documentation does not deliver errors or alerts until a provider and recipient are configured and tested.
- Lazy route loading changes chunk boundaries and needs the full browser suite, including direct hash links and reloads.

## Outcome

- The complete verification gate passes: 30 unit tests and 38 Chromium scenarios, plus formatting, design-system, lint, type, participant-package, build, release-manifest and rollback checks.
- The release candidate now records exact source, lockfile, storage-schema and artifact identity; a manual artifact edit was correctly rejected by verification.
- Route splitting reduced the largest JavaScript chunk from about 654 kB to about 421 kB and the initial compressed entrypoint to about 162 KiB.
- A privacy-safe root error boundary and generic local browser event are prepared, but no external monitoring destination is connected.
- Release, incident, capacity, monitoring and deployment-decision runbooks are prepared without selecting a provider or creating an external account.
- The remaining blockers are deployment-stage evidence: hosting/HTTPS, named operational ownership and access, expected-use/provider limits, and delivered monitoring/alerts.
