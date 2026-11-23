# Static release rollback

This runbook restores the last known-good static `dist/` artifact when a newly published version prevents the main journey, fails the post-release smoke check or causes a serious accessibility or data-recovery regression. It does not reset Git, rebuild an old commit or modify browser data.

## Release record required before publishing

Keep these values together in the hosting release note:

- source commit and repository content fingerprint;
- immutable artifact identifier or SHA-256 digest;
- hosting deployment identifier and public address;
- result of `./scripts/verify` and the post-release smoke check;
- identifier of the previous known-good deployment;
- persisted-data schema version used by both releases.

Do not replace the previous artifact until the new release has passed its smoke check. The current prototype uses `doroboty.prototype.v1` and schema version `1` in browser localStorage.

## Rollback decision

Rollback when the public address is unavailable, the main publish/apply/review journey cannot be completed, exported data cannot be imported, or a serious keyboard/mobile/accessibility regression is observed. Stop and investigate instead of switching versions when the new release changed the persisted schema and the previous release cannot read the resulting data.

## Procedure

1. Stop further publishing and record the failing deployment identifier. Do not delete it; it is diagnostic evidence.
2. Confirm the previous known-good deployment identifier and its immutable artifact digest from the release record.
3. Confirm data compatibility. For the current frontend-only version, both artifacts must use schema version `1`. A static deployment never clears browser localStorage, but older code must still understand its contents.
4. Use the hosting provider's atomic promotion or redeploy control to point the same public origin at the previous immutable artifact. Do not rebuild the old source because dependency resolution could produce different bytes.
5. Confirm that the provider reports the expected deployment identifier and artifact digest.
6. At the public address, run the complete [post-deployment smoke test](SMOKE_TEST.md) against the restored deployment. Confirm that existing local scenario data remains readable.
7. Record the rollback time, operator, failed and restored identifiers, smoke result and any user communication.

If the provider cannot atomically promote an older artifact, upload the retained known-good artifact to a new deployment and switch traffic only after its digest and smoke check pass. Provider-specific button names and access roles must be added here after hosting is selected.

## Local rehearsal

Run the production build first, then the isolated drill:

```sh
npm run build
npm run verify:rollback
```

The drill copies `dist/` into a temporary release archive, deploys a deliberately invalid candidate, stages the archived artifact and switches back to it. It verifies the restored tree byte-for-byte against the known-good digest and checks that the persisted schema is still version `1`. The temporary directory is removed in all outcomes; the drill does not use port 3001, a hosting account or browser localStorage.

This rehearsal proves the repository's artifact-level recovery procedure. It does not prove a future hosting provider's permissions, retention policy or production traffic switch; those must be checked on the selected provider before admitting users. The smoke plan is preparation evidence only until it is executed against the exact deployed version and address.
