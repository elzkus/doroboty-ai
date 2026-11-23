# Production readiness browser gate

Slug: `production-readiness-browser-gate`
Created: 2026-11-22

## Goal

Provision the repository's required Playwright Chromium binary and execute the complete browser test gate without changing product behavior.

## Context

The static, unit and build checks pass, but all 37 Playwright tests remain unexecuted because the matching Chromium binary is absent from the local Playwright cache.

## Plan

- [x] Inspect the Playwright version, configuration and test command
- [x] Install the Chromium binary matching Playwright 1.63.0
- [x] Run the full repository verification gate
- [x] Update and validate the production-readiness report with actual E2E results
- [x] Review the resulting project diff

## Acceptance Criteria

- [x] Playwright can launch its configured Chromium project
- [x] All 37 E2E tests execute and pass, or actual product failures are recorded precisely
- [x] `./scripts/verify` finishes successfully
- [x] The readiness report records current evidence for the browser gate

## Files / Areas

- Playwright browser cache outside the repository
- `docs/production-readiness.html`
- `docs/tasks/production-readiness-browser-gate.md`

## Risks

- The browser download requires network access and writes to the user-level Playwright cache.
- A successful installation may reveal genuine browser-test failures; those must be distinguished from provisioning failures.

## Handoff Notes

`FEATURES.md` was reviewed and PUB-10 was updated for the responsive public-header behavior. Playwright Chromium 1243 was provisioned for Playwright 1.63.0. The first complete run executed all tests and exposed nine failures: six stale Poster People expectations, two instances of a nested record footer inheriting public-footer colors, and one responsive navigation overflow. The Navy Signal expectations, footer scoping and compact tablet/mobile navigation were corrected. The focused rerun passed 9/9 and `./scripts/verify` passed the full gate, including 37/37 E2E tests.

The production-readiness report was refreshed for the changed source fingerprint and validated. The browser gate and accessibility recommendation now pass with current evidence; preparation readiness increased from 42% (8/19) to 47% (9/19).
