# Architecture

One React/TypeScript application is built by Vite into static files. HashRouter renders routes under /#/; route parameters created in the browser require no hosting rewrites. Route modules load on demand behind the persistent shell so the public entry does not fetch every candidate, employer and instructor screen. The running app uses local Navy Signal CSS tokens, a system sans-serif stack and Base UI primitives. New and changed UI must follow the active Navy Signal [design system](design-system/NAVY_SIGNAL.md), adapted into the existing stack. There is no server data/API layer.

## Data flow

JSON marketplace/person fixtures → initialState → PrototypeProvider → feature views. Local operations go through transition with shared Zod schemas and explicit role/ownership/transition checks for coherent simulation. All roles still have access to the same browser data; these checks are not security.

Candidate source notes, generated draft and approved application are distinct fields. Submission snapshots CV, candidate name, job title, scenario score and summary. Employer stage events are appended, with private-in-the-UI notes. Profile/job edits do not rewrite submitted records.

Storage uses one versioned localStorage key. Import validates schema/version, unique IDs, cross-references and stage history before replacing state. Unreadable/incompatible saves are protected against automatic overwrite; settings can download the original raw save, import a valid file or explicitly reset. Failed/quota-limited persistence leaves the in-memory app usable and offers export. Import/export is capped at 2 MB; no binary CV storage.

The root React error boundary replaces a failed render with a generic recovery screen without clearing browser data. Uncaught errors, rejected promises and render failures emit a sanitized `doroboty:operational-error` browser event containing only a generic class and timestamp. No event leaves the browser until a separately selected and privacy-reviewed monitoring adapter is configured.

## Features

src/features/prototype owns model/storage/state and page compositions. src/features/jobs retains reusable presentation/filter/description logic; src/components/ui owns Base UI controls. Keep changes small.

LocalStorage is origin-specific. Reload preserves state; another browser/device/port starts separately. No cross-tab live synchronization is provided; close other tabs before editing/importing. Hash links reference records in the receiving browser, not transferred records.

## Evidence and distribution

The baseline historical CSV and JSON are separate from interactive state. Future evidence must arrive in a separately reviewed package. package:participant copies only explicit allowed files/directories, including the complete docs/design-system guide/kit, and omits docs/source, historical task notes, agent run history and .git. A packet verifier checks the baseline data; packaging also verifies a pristine file/hash manifest. Ordinary checks permit participants to edit code and generate build/test output without invalidating a distribution fingerprint. Instructor repository history is never participant-safe.

## Checks

npm run check and ./scripts/verify run formatting, design-system reference integrity/example checks, lint, types, unit tests, build, release-manifest creation/verification, an isolated static-artifact rollback rehearsal and Playwright against the static preview. The release manifest binds source identity, lockfile, storage schema, file hashes and asset-budget measurements to one `dist/` candidate. The rollback rehearsal verifies an immutable known-good digest in a temporary directory and checks the persisted schema boundary; neither step changes browser data or a deployed environment. Playwright checks external requests, complete workflows, error/recovery behavior, keyboard controls and mobile layout. No test starts system services. npm run dev only starts Vite. See [the release procedure](RELEASE.md), [rollback runbook](ROLLBACK.md) and [incident response](INCIDENT_RESPONSE.md) for provider handoff.
