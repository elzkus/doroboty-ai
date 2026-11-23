# Production readiness restore drill

Slug: `production-readiness-restore-drill`
Created: 2026-11-22

## Goal

Prove that a complete local prototype scenario can be recovered from the JSON file produced by the built-in export flow.

## Context

Import validation and export download are covered independently, but there is no durable round-trip check that exports representative local data, changes the stored state, imports that exact file and verifies the recovered records after a reload.

## Plan

- [x] Add an isolated browser restore drill using synthetic profile and application data
- [x] Export the scenario through the UI, mutate local storage and import the downloaded copy
- [x] Verify recovered profile, application and history data after reload
- [x] Run the complete repository verification gate
- [x] Update and validate the production-readiness report with the restore evidence
- [x] Review the resulting project diff

## Acceptance Criteria

- [x] The test uses the file emitted by the real export control
- [x] Importing that file restores representative profile, application and event-history fields
- [x] Restored data remains available after a browser reload
- [x] The test runs on the isolated Playwright origin and does not touch the user's port 3001 data
- [x] `./scripts/verify` finishes successfully
- [x] The readiness report records the restore drill result

## Files

- `tests/e2e/prototype.spec.ts`
- `docs/production-readiness.html`
- `docs/tasks/production-readiness-restore-drill.md`

## Risks

- A download-only assertion could pass without proving recovery, so the test must import the exact downloaded bytes and inspect restored records.
- The drill must use synthetic state in Playwright's isolated browser context rather than the user's working browser profile.

## Product behavior register

`FEATURES.md` was reviewed. This change verifies existing `SYS-09` and `SYS-10` behavior and does not change product behavior.

## Outcome

The isolated Playwright drill exported a representative synthetic scenario, replaced its local profile and removed its application, then imported the exact downloaded bytes. After reload, the profile, application answer, process stage and event history matched the backup. The complete verification gate passed with 29 unit tests and 38 browser tests.
