# Capacity and static asset guard

DoRoboty.ai is a static frontend with no application server, database or runtime API. Hosting capacity is therefore mainly HTTPS request volume and transfer for static assets; browser-local operations do not consume a shared backend.

## Automated regression guard

Every verified build creates `dist/release-manifest.json` and checks these repository-level limits:

- initial compressed entrypoint assets: at most 256 KiB;
- the complete compressed artifact, including the optional local logo library: at most 12 MiB;
- any single JavaScript file: at most 512 KiB uncompressed.

These limits protect the current lightweight teaching prototype from accidental asset growth. They are not universal performance targets and do not prove that an unknown hosting plan, connection or participant device is sufficient. Route modules are loaded on demand so the first page does not require every workspace screen.

The 2026-11-22 local candidate measured about 162 KiB compressed for initial entrypoint assets, 11.14 MiB compressed for the complete artifact (mostly the optional local company-logo library), and 421 KiB uncompressed for the largest JavaScript chunk. Before route splitting the application produced one 654 KiB JavaScript chunk; the current build separates public, candidate, employer and instructor routes. The candidate manifest remains the source of exact byte counts.

Run `npm run release:prepare` from recorded, clean source. The manifest contains actual per-file and aggregate measurements for that candidate.

## Decision required before hosting

Complete the capacity section in [deployment decisions](DEPLOYMENT_DECISIONS.md): expected simultaneous participants, approximate sessions, acceptable page-load experience, transfer/cost ceiling and the provider limits that cover them. Use the chosen provider's current documentation and pricing at that time.

After deployment, compare the served artifact identity and provider transfer/resource observations with the agreed values. Low traffic is not proof that higher expected traffic is supported.
