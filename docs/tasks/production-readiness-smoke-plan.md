# Production readiness post-deployment smoke plan

Slug: `production-readiness-smoke-plan`
Created: 2026-11-22

## Goal

Prepare a short, repeatable control plan that tells the release operator what to check immediately after publishing, what evidence to retain and when to roll back.

## Context

The local browser suite exercises the full prototype, but it does not prove that the published artifact, target address, HTTPS configuration and static hash routes work in the selected hosting environment. Hosting has not been selected yet, so the procedure must remain provider-independent and must not claim that a deployment has been verified.

## Plan

- [x] Identify the smallest representative public, candidate and employer journey
- [x] Keep the check isolated from participant data by using a fresh browser profile and synthetic records
- [x] Define the release identity and evidence that must be recorded
- [x] Define pass, stop and rollback conditions
- [x] Link the smoke plan to the existing immutable-artifact rollback procedure
- [x] Run the complete repository verification gate
- [x] Refresh and validate the production-readiness report
- [x] Review the resulting diff separately

## Acceptance Criteria

- [x] The plan identifies who runs it and when
- [x] The plan checks the exact target URL and deployment identity
- [x] The plan covers a hash deep link, the main cross-role journey, reload persistence and export/import
- [x] The plan uses only synthetic data in an isolated browser profile
- [x] Every step has an observable pass result
- [x] Failure leads to a clear stop or rollback decision
- [x] The result template avoids secrets and personal data
- [x] The readiness report records current evidence for the prepared plan

## Files

- `docs/SMOKE_TEST.md`
- `docs/ROLLBACK.md`
- `README.md`
- `docs/production-readiness.html`
- `docs/tasks/production-readiness-smoke-plan.md`

## Product behavior register

`FEATURES.md` was reviewed. This change documents release operations and does not alter runtime product behavior, so no register update is required.

## Risks

- A passing local test does not replace executing this plan at the actual published address.
- Browser-local state means the check must use a dedicated profile; importing a smoke backup into a participant's browser would replace their scenario.
- Provider logs and deployment identifiers cannot be named until hosting is selected.

## Outcome

The provider-independent smoke plan now assigns the check to the release operator, requires a fresh private browser profile and records the exact URL, deployment, source, artifact, configuration and previous known-good version. Six short controls cover static delivery, hash-route reload, the cross-role journey, export/import recovery, critical mobile/keyboard use and failure signals. All controls must pass; otherwise distribution stops and the existing immutable-artifact rollback procedure applies. The full repository gate passed with 29 unit tests and 38 browser tests. Execution against the future production URL remains a separate deployment-stage check.
