# Static prototype incident response

Use this runbook when the published address is unavailable, required assets fail, the main publish → apply → review journey breaks, browser-local data cannot be read or imported, or a serious keyboard/mobile defect blocks the exercise.

The named incident owner and provider-specific access are intentionally left in [deployment decisions](DEPLOYMENT_DECISIONS.md). Until they are confirmed, this is a prepared procedure rather than a verified production response.

## 1. Stop and record

1. Stop sharing the URL and pause further publishing. Do not delete the failing deployment.
2. Record time and timezone, reporter, target URL, deployment identifier, artifact digest, configuration revision and the failing smoke step. Do not copy localStorage, exported scenario content, real CVs, tokens or free-text application answers.
3. Ask participants to keep their tab open and export their synthetic scenario if the interface remains usable. A static rollback does not erase browser localStorage, but closing a tab after a storage failure can lose in-memory changes.

## 2. Classify the failure

- **Address, HTTPS or assets fail:** inspect provider deployment status and safe request/error summaries. Confirm the expected deployment identifier and manifest digest.
- **Blank screen or JavaScript failure:** reproduce in a fresh private profile, record the route and generic error class, and check whether the same artifact passed its release verification. Do not record user-entered text or browser storage.
- **Main journey fails:** rerun only the failed [smoke-test](SMOKE_TEST.md) step with synthetic data. Do not experiment in a participant's profile.
- **One browser's scenario is unreadable:** keep the deployment unchanged initially. Follow Settings recovery: download the protected raw save when offered, export readable data, then validate import in an isolated profile before reset.
- **Schema compatibility is uncertain:** stop. Do not roll back until both artifacts are confirmed to read schema version `1` or a separate migration/recovery decision is made.

## 3. Recover service

For an artifact or application regression, follow [ROLLBACK.md](ROLLBACK.md) and restore the previous immutable artifact. Verify the provider deployment identifier and retained artifact digest, then repeat the complete smoke test against the restored URL.

For browser-local data, use the validated export/import path in an isolated profile. Never overwrite the affected profile merely to test whether a backup works.

## 4. Communicate

Use a short message without technical secrets or personal data:

```text
Status: wykryliśmy problem z prototypem DoRoboty.ai i wstrzymaliśmy udostępnianie.
Wpływ: [który krok ćwiczenia jest niedostępny].
Działanie użytkownika: pozostaw kartę otwartą; jeśli ustawienia działają, wyeksportuj syntetyczny scenariusz. Nie przesyłaj prawdziwych CV ani danych osobowych.
Następna aktualizacja: [konkretny kanał lub warunek, nie obietnica bez właściciela].
```

After recovery, report the restored deployment identifier, smoke result and whether participants need to import a saved scenario. Open a follow-up issue for the cause; do not put scenario content in it.

## 5. Close the incident

Record the operator, decision, failed/restored identifiers, manifest digests, smoke result, user communication and follow-up owner. Keep evidence with the hosting release record.

The repository rehearses artifact rollback and export/import recovery inside `./scripts/verify`. That proves the local procedures and schema boundary, not future provider permissions or alert delivery.
