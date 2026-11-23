# Navy Signal design-system migration

## Intent

Replace the Poster People visual direction with the Supersprint Navy Signal system while
preserving the prototype's routes, local state, behaviors and accessible component semantics.

## Acceptance criteria

- Public navigation and hero use the navy brand frame, blue interaction color and scarce yellow signals.
- Listings, offer details, profiles, records and forms use light canvas, white surfaces and cool borders.
- The application uses one sans-serif family; no serif headings or pink primary actions remain.
- Shared controls retain at least 44px targets, visible focus and existing Base UI behavior.
- Workspace navigation uses a navy shell and remains usable at desktop and mobile widths.
- Existing candidate, employer, CV, questionnaire and application flows remain functionally unchanged.
- The product contract and design-system guidance name Navy Signal as the active authority.

## Verification

- `npm run lint`, `npm run typecheck`, `npm test` and `npm run build` pass; 29 unit tests pass.
- Desktop browser review covers home, listing, offer, company, candidate profile and AI questionnaire. Each uses sans-serif headings, has no old pink runtime color and has no horizontal overflow.
- The focused Playwright run reaches the test runner but cannot launch because the provisioned environment has no Chromium executable. No browser download was performed.
- `./scripts/verify` stops at `format:check` on two pre-existing research files outside this task: `research/2026-11-17-desk-apply-survey.md` and `research/desk-research-state.json`.
