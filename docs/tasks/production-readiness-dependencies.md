# Production readiness dependency assessment

Slug: `production-readiness-dependencies`
Created: 2026-11-22

## Goal

Assess known vulnerabilities for the exact dependency versions in `package-lock.json`, remediate actionable findings safely and make the result reproducible.

## Context

The application builds and tests successfully, but the readiness report has no current vulnerability result. A prior `npm audit` attempt could not reach the configured audit endpoint, and the lockfile alone is not evidence that dependencies are safe.

## Plan

- [x] Inspect npm registry configuration and the resolved dependency tree without exposing credentials
- [x] Run a current audit for all locked production and development dependencies
- [x] Review each finding against the application's browser-only architecture and build pipeline
- [x] Apply compatible dependency updates if the audit identifies actionable findings
- [x] Keep the audit documented but outside the offline gate while the configured endpoint is unreliable
- [x] Run the complete repository verification gate
- [x] Update and validate the production-readiness report with current evidence
- [x] Review the resulting project diff

## Acceptance Criteria

- [x] The assessment covers versions resolved by the current lockfile
- [x] Audit output is summarized without copying credentials or unnecessary registry metadata
- [x] High and critical findings are either fixed or documented with concrete impact and next action
- [x] The full repository verification gate passes after any lockfile change
- [x] The readiness report records the audit date, command and actual vulnerability counts

## Files

- `package.json`
- `package-lock.json`
- `docs/DEPENDENCIES.md`
- `docs/production-readiness.html`
- `docs/tasks/production-readiness-dependencies.md`

## Risks

- Registry availability can block a fresh advisory lookup; that remains unverified rather than passing.
- Forced or major upgrades can introduce regressions, so remediation must stay within compatible versions unless separately approved.
- Development-only findings still matter because build and test tooling handles repository content and produces the release artifact.

## Product behavior register

`FEATURES.md` was reviewed. Dependency-only and verification-only changes do not alter runtime product behavior, so no register update was required.

## Outcome

The initial audit reported 10 moderate entries, all derived from one `minimatch` advisory, with no high or critical findings. Updating `typescript-eslint` to 8.73.0 and applying a narrow `@ts-morph/common` child override to `minimatch` 11.0.9 reduced the final audit to zero findings across 494 packages. The `shadcn` CLI loaded successfully, and the complete repository gate passed with 29 unit tests and 38 browser tests.
