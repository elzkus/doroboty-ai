# Dependency security assessment

Last assessed: 2026-11-22

## Scope and command

The assessment covers all production, development and optional packages resolved by `package-lock.json` under Node.js 24 and npm 11. Run:

```sh
npm audit --audit-level=moderate
```

The project normally uses the configured company npm registry. Its audit endpoint returned the initial result but was intermittently unavailable during remediation, so the final audit was also checked directly against `https://registry.npmjs.org`, which is already the resolved source recorded in the lockfile. A lockfile, successful install or successful build is not a substitute for a fresh advisory lookup. Do not add the network-dependent command to the offline `./scripts/verify` gate unless the audit endpoint becomes reliable in every required environment.

## 2026-11-22 finding and remediation

The initial audit reported 10 moderate entries, zero high and zero critical entries across 493 packages. All 10 entries traced to one advisory, `GHSA-g3hv-75wg-m249`, for `minimatch` versions below 11.0.1. The vulnerable copies were development/build dependencies reached through `typescript-eslint` and `shadcn` → `ts-morph` → `@ts-morph/common`; they were not included as application runtime modules.

Remediation:

- update `typescript-eslint` to 8.73.0, whose parser tree uses `minimatch` 11;
- override only `@ts-morph/common`'s `minimatch` child to 11.0.9;
- retain the older ESLint-only `minimatch` 3.x branch because the maintainer advisory identifies the vulnerable implementation in 10.2.6, while a blanket override would break consumers of the old CommonJS API;
- run the full lint, type, unit, build, rollback and browser gate after the dependency change;
- rerun `npm audit` and record the resulting severity counts in the production-readiness report.

The narrow override is covered by loading the `shadcn` CLI and by the full project verification gate. Reassess the override when `shadcn` updates its `ts-morph` dependency to a release that natively uses `minimatch` 11, then remove it if the audit remains clean.

Final result: 0 info, 0 low, 0 moderate, 0 high and 0 critical vulnerabilities across 494 resolved packages. `./scripts/verify` also passed with 29 unit tests, the static build, rollback drill and 38 browser tests.
