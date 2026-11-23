# DoRoboty.ai — AIPH3 prototype

A frontend-only job marketplace for participants to extend and test. Built with React, TypeScript and Vite, using Base UI components. The active visual direction is the Navy Signal design system.

## Design system — start here for UI work

Read [project integration instructions](docs/design-system/README.md) and the active [Navy Signal contract](docs/design-system/NAVY_SIGNAL.md) before changing UI. Build with the navy brand frame, blue actions, scarce yellow signals, sans-serif typography and light white-on-canvas work surfaces. Preserve application behavior, accessibility and hash routing.

The previous Poster People kit remains under `docs/design-system/agent-kit` as historical evidence and is still covered by its integrity check. It is not the visual authority for new work.

## Run

Requirements: **Node.js 24 and npm**.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3001. No environment file, account, database or additional service is required. Package installation requires access to the npm registry.

Select Anna or Marek as a candidate, Karolina or Tomasz as an employer, or the instructor. Publish a job, apply, switch person and record the employer decision. Changes survive reload in this browser; settings provide export, import and reset. AI and scores simulate prepared scenarios. Use example CVs only.

## Build and verify

```sh
npm run build
npm run preview
./scripts/verify
npm run release:prepare
```

The static output is dist/. Browser checks require an already provisioned Playwright Chromium; starting the app never installs it. See [participant guide](docs/PARTICIPANT_GUIDE.md), [architecture](docs/architecture.md), [current features](FEATURES.md) and [case protocol](docs/case/CASE_PROTOCOL.md).

Before publishing, complete the non-secret [deployment decisions](docs/DEPLOYMENT_DECISIONS.md), follow the [release procedure](docs/RELEASE.md) and retain the current immutable `dist/` artifact and manifest as the previous known-good release. The provider-independent [rollback runbook](docs/ROLLBACK.md) and [incident response](docs/INCIDENT_RESPONSE.md) define recovery. Immediately after publishing and before sharing the URL, the release operator runs the [post-deployment smoke test](docs/SMOKE_TEST.md) and records the exact deployment result. [Capacity](docs/CAPACITY.md) and [monitoring](docs/MONITORING.md) document the remaining provider decisions and checks.

To distribute a baseline participant package, run npm run package:participant -- /absolute/output/directory. This excludes Git history and instructor source material. Never distribute this repository’s history as a stage-safe packet.
