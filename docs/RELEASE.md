# Static release procedure

This procedure prepares one identifiable `dist/` candidate. It does not choose a hosting provider or prove that uploaded bytes are live.

## Prepare the candidate

Use Node.js 24 and the committed lockfile. The publishable command intentionally refuses a dirty worktree so that a release can be tied to recorded source.

```sh
npm ci
./scripts/verify
npm run release:prepare
```

`release:prepare` builds the static app, creates `dist/release-manifest.json` and verifies the result. The manifest records:

- source commit, source-tree SHA-256 and whether the tree was dirty;
- `package-lock.json` SHA-256;
- SHA-256 and compressed/uncompressed size for every artifact file;
- one digest for the complete immutable artifact;
- initial and total compressed asset measurements;
- browser-storage key and schema version.

Do not edit `dist/` after the manifest is created. `npm run release:verify` must still pass immediately before upload.

## Retain and publish

1. Copy the complete `dist/` directory, including `release-manifest.json`, into immutable release storage.
2. Record the manifest artifact digest as the release candidate identifier.
3. Retain the previous known-good artifact and its digest. Do not overwrite it.
4. Upload or promote the exact candidate through the selected provider. Do not rebuild it in the provider UI unless that build is independently tied to the same source and produces a new verified manifest.
5. Record the provider deployment identifier, exact HTTPS URL and non-secret configuration revision next to the artifact digest.
6. Before sharing the URL, run the [post-deployment smoke test](SMOKE_TEST.md).
7. Keep or roll back according to the smoke result and [rollback runbook](ROLLBACK.md).

## Provider handoff still required

After hosting is selected, add its exact build/output settings, immutable-artifact retention rule, deployment identity field, promotion/rollback control and required role to this document. Confirm those controls on a safe deployment before admitting participants.

Never store provider credentials, tokens or secret values in this repository or the release record.
