# Post-deployment smoke test

Run this control immediately after publishing and before sharing the URL with participants. It should be performed by the **release operator — the person who published the deployment** — in a fresh private browser profile. Record that person's name in the result. Use only the prepared personas and synthetic text; never use a real CV or participant data.

This plan verifies one concrete deployment. It does not replace `./scripts/verify`, monitoring or later observation with users.

## Before starting

Record the following without secrets:

- target HTTPS URL;
- deployment identifier and publishing time shown by the hosting provider;
- source commit or repository fingerprint and immutable artifact digest;
- configuration revision or hosting settings identifier;
- previous known-good deployment identifier and artifact digest;
- release operator's name;
- expected browser-storage schema: `doroboty.prototype.v1`, version `1`.

Stop before testing if the deployed version cannot be tied to the intended source and artifact, or if the previous known-good deployment cannot be identified.

## Control — expected duration under 10 minutes

Use a fresh private browser profile at desktop width. Prefix any created title or answer with `[SMOKE <deployment-id>]` so the record is recognisable as synthetic.

1. **Address and static delivery.** Open the exact target URL and confirm HTTPS has no browser warning, the DoRoboty.ai home page renders with styles and images, and the hosting provider reports the expected deployment as active.
2. **Hash route and reload.** Open `<target>/#/oferty/ai-product-manager` directly, then reload. The `AI Product Manager` offer must still render without a 404, blank page or missing assets.
3. **Main cross-role journey.** In this isolated profile choose Karolina, publish one synthetic job; choose Anna, find it, save an application draft, reload and confirm the draft remains; submit it; return as Karolina, open Anna's application and move it to `W przeglądzie`; reload and confirm that stage remains. No real network service or participant account should be involved.
4. **Recovery path.** In Settings export `doroboty-scenariusz.json`, import that same file and confirm the success message. Reload and confirm the smoke application and process stage still exist. Keep the file only with the release evidence, or delete it after recording the result.
5. **Critical usability check.** At approximately 390 px width confirm navigation opens and the offer/application content does not require horizontal scrolling. Using the keyboard, reach the primary action and observe a visible focus indicator.
6. **Failure signals.** Confirm there was no uncaught-error screen or persistent error message. Inspect the browser console for uncaught application errors and the hosting deployment status/log view for failed asset requests. Do not copy free text, storage contents, tokens or secrets into the result.

All six controls must pass. Record each as `PASS` or `FAIL`; do not describe an unexecuted step as passed.

## Decision

Keep the deployment only when all controls pass for the recorded deployment identifier.

Stop distribution and follow [the rollback runbook](ROLLBACK.md) when the target address or required assets are unavailable, the hash deep link fails, the publish → apply → review journey cannot be completed, state disappears after reload, export/import fails, or a serious mobile/keyboard regression blocks the task.

Do not roll back automatically when the new artifact changed the persisted-data schema and the previous artifact cannot read it. Stop distribution and resolve data compatibility first. For the current prototype both artifacts must use schema version `1`.

After rollback, repeat this same smoke test against the restored deployment and record a new result.

## Result record

Store the following in the hosting release note or other agreed release record:

```text
Date and timezone:
Operator:
Target URL:
Deployment ID:
Source commit/fingerprint:
Artifact SHA-256:
Configuration revision:
Previous known-good deployment ID:
Storage schema: doroboty.prototype.v1 / version 1

1. Address and static delivery: PASS | FAIL — short non-sensitive observation
2. Hash route and reload: PASS | FAIL — short non-sensitive observation
3. Main cross-role journey: PASS | FAIL — short non-sensitive observation
4. Recovery path: PASS | FAIL — short non-sensitive observation
5. Critical usability: PASS | FAIL — short non-sensitive observation
6. Failure signals: PASS | FAIL — short non-sensitive observation

Decision: KEEP | STOP | ROLLBACK
Restored deployment ID, if applicable:
Follow-up owner and issue link, if applicable:
```
