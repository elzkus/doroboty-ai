# Monitoring preparation

Monitoring must reveal that the published prototype is unavailable or unusable without collecting participant application text, CVs, localStorage, exported scenarios, tokens or other browser content.

## Configured product signal

The published prototype uses EU PostHog when `VITE_POSTHOG_PROJECT_TOKEN` is present during the
Netlify build. The adapter records sanitized route groups, successful domain actions and the
existing generic operational-error class. Autocapture is limited to clicks on links and buttons on
public, non-form pages. Forms, inputs, authentication, application flows and the entire user
workspace are excluded; element text and attributes are masked. Raw page URLs, persistence, person
profiles, surveys, heatmaps, performance capture, external dependency loading and session replay
remain disabled in code. The public project token is a build setting, not an application secret.

## Signals to configure after hosting review

1. **Availability:** the exact HTTPS root and `/#/oferty/ai-product-manager` return the application shell and required assets.
2. **Static delivery:** provider deployment status/logs show failed HTML, JavaScript, CSS or image requests for the recorded deployment.
3. **Browser failures:** uncaught JavaScript errors are grouped by release/deployment identifier and generic error type.
4. **Journey health:** the post-deployment smoke result is attached to the release record; later observation uses agreed real-user criteria rather than raw form content.
5. **Alert delivery:** a safe test notification reaches the named incident owner through the agreed channel.

## Safe event policy

Allow only release/deployment identifier, timestamp, route template, browser family, generic error class and a generated event identifier. Do not send URL query text, DOM contents, stack locals, localStorage, imported/exported JSON, names, CV text, application answers, employer notes, tokens or source maps containing secrets. Review the selected tool's defaults before enabling session replay, breadcrumbs or automatic user/context capture; keep those features off unless separately justified.

The application already catches render failures behind a generic Polish recovery screen and emits the browser event `doroboty:operational-error`. Its detail contains only `kind` (`react-render`, `uncaught-error` or `unhandled-rejection`) and `occurredAt`; it deliberately excludes the error message, stack, route and browser storage. A future provider adapter may listen for this event and add the verified release identifier, but must preserve the safe-field policy.

## Configuration and test

After a provider/tool is selected:

1. record its non-secret configuration revision and access role;
2. configure release identity from `release-manifest.json`;
3. restrict collection to the safe fields above;
4. trigger a harmless synthetic error in an isolated profile or provider test mechanism;
5. confirm the event is searchable without sensitive content;
6. send a test alert and confirm delivery to the named owner;
7. record the target deployment, time, event identifier and recipient confirmation in the readiness report.

PostHog product events are selected and locally verified. Production delivery and alerting remain
deployment-stage evidence and must not be inferred from repository configuration alone.
