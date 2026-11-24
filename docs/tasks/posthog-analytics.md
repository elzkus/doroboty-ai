# PostHog product analytics

## Intent

Add privacy-conscious product analytics to the published Netlify prototype using the existing EU PostHog project.

## Acceptance criteria

- PostHog initializes only when a `VITE_POSTHOG_PROJECT_TOKEN` is configured.
- Events use the EU ingestion host and contain no names, emails, free text, CV content, notes, search terms or raw URLs.
- Automatic DOM capture, persistence, person profiles and session replay stay disabled.
- The prototype records sanitized route groups and successful domain actions such as saves, drafts, submissions and recruiting-stage changes.
- Operational errors may be counted only by their existing generic class.
- The full verification script passes before deployment.

## Evidence

- `./scripts/verify` passed on 2026-11-24: formatting, design-system integrity, lint, typecheck,
  31 unit tests, participant packet validation, production build, release manifest, rollback drill
  and 38 Chromium journeys.
- The release manifest verified 48 files with initial gzip size 163,483 bytes; PostHog is split into
  a deferred chunk so the initial asset budget remains within its 262,144-byte limit.
- Review confirmed that `.env.local` is ignored, no token is committed, dynamic route values are
  reduced to route groups and only successful domain transitions emit action events.
