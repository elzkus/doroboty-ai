# Production readiness format gate

Slug: `production-readiness-format-gate`
Created: 2026-11-22

## Goal

Restore the repository formatting gate without changing application behavior.

## Context

The generated `docs/production-readiness.html` is an atomic offline artifact and must not be rewritten by Prettier. Two existing research files also fail the current formatting check.

## Plan

- [x] Review the formatting configuration and current failures
- [x] Exclude the generated readiness report from Prettier
- [x] Format the two failing research files
- [x] Run verification and record remaining independent blockers
- [x] Review the resulting diff for unintended content changes

## Acceptance Criteria

- [x] `npm run format:check` passes
- [x] The readiness report remains valid and is not rewritten by Prettier
- [x] Research changes are formatting-only
- [x] `./scripts/verify` runs through the formatting stage; any independent failure is reported accurately

## Files / Areas

- `.prettierignore`
- `research/2026-11-17-desk-apply-survey.md`
- `research/desk-research-state.json`
- `docs/production-readiness.html`

## Risks

- A broad formatter run could touch unrelated user changes; limit formatting to the two known research files.
- Regenerating the readiness report changes its embedded audit state; update it only through the skill renderer.

## Handoff Notes

`FEATURES.md` was reviewed. This maintenance change does not alter product behavior, routes, roles, data boundaries or UI.

`npm run format:check` passes. `./scripts/verify` also passes the design-system check, lint, typecheck, 29 unit tests, the 120-journey participant-packet verification and the production build. The remaining independent blocker is the unavailable Playwright Chromium binary, so 37 E2E tests did not execute. The readiness report was regenerated and validated as revision 5; it records the formatting gate as passed and the browser gate separately as unverified.
