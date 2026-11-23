# DoRoboty.ai design system

**Navy Signal is the active visual authority.** Start with [NAVY_SIGNAL.md](NAVY_SIGNAL.md)
and the root [GUI.md](../../GUI.md). New or changed screens use navy brand framing,
blue actions and focus, scarce yellow signals, one sans-serif family, light canvas
backgrounds and white work surfaces.

## Active implementation

- Tokens and compatibility aliases: [tokens.css](../../tokens.css)
- Runtime foundation and component overrides: [navy-signal.css](../../src/app/navy-signal.css)
- Product behavior register: [FEATURES.md](../../FEATURES.md)
- Migration task and acceptance: [navy-signal-migration.md](../tasks/navy-signal-migration.md)

Preserve React, TypeScript, Base UI behavior, keyboard and focus states, hash routes
and local product state. Existing `.pp-*` class names are legacy implementation
selectors, not permission to restore the previous visual language.

## Historical reference

The `agent-kit` directory and older companion documents in this folder describe the
previous Poster People system. They remain available as historical implementation
evidence and regression context. Do not use their serif typography, pink actions,
paper canvas or illustrated people when creating or restyling UI.

The historical kit integrity command remains available as
`npm run design-system:check`, but passing it does not verify Navy Signal adoption.

## Verification

Review affected public and workspace screens at desktop and mobile widths, including
long copy, empty and error states, dialogs, keyboard behavior and focus restoration.
Run:

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

Use `./scripts/verify` for the repository gate. It also checks the preserved historical
kit and Playwright journeys, so its environment must already contain Chromium.
