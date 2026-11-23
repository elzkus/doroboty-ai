@AGENTS.md

Start with npm ci and npm run dev. Do not infer work from historical course material. Keep durable task notes in docs/tasks and review the actual diff before claiming completion.

## UI work is based on the local design system

Read [project integration instructions](docs/design-system/README.md), the active [Navy Signal contract](docs/design-system/NAVY_SIGNAL.md) and [GUI.md](GUI.md) before UI work. Navy Signal is the required visual direction for new and changed screens. The Poster People kit and its companion documents are retained only as historical evidence.

Use the packaged CSS, anatomy, responsive examples, local Geist Serif and illustration. Adapt them into existing React features, Base UI `render` components and host tokens; preserve hash routing, Zod, persona data, localStorage and application/employer workflows. The vanilla example controllers and numeric demo jobs are references, not product code to mount. Scope visual changes to the requested task. Follow the current ownership map and compare actual anatomy/type/state with the source; updating guidance alone does not verify the running UI.

From the repository root: `npm run design-system:dev` previews the kit at port 8952; `npm run design-system:check` verifies its 67 original files and examples. The main app still runs with npm run dev at port 3001. No kit dependencies or global skills are required. Keep docs/design-system/agent-kit immutable. Validate new UI at desktop/mobile widths and with keyboard/state checks, run ./scripts/verify, update FEATURES.md for actual behavior changes and report actual evidence.
