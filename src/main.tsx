import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./features/prototype/app";
import { OperationalErrorBoundary } from "./features/prototype/error-boundary";
import { installOperationalErrorCapture } from "./lib/operational-errors";
import { captureAnalytics, initializeAnalytics } from "./lib/analytics";
import "./app/globals.css";

void initializeAnalytics();
installOperationalErrorCapture();
window.addEventListener("doroboty:operational-error", (event) => {
  const kind = (event as CustomEvent<{ kind?: string }>).detail?.kind;
  captureAnalytics("operational_error", { kind });
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OperationalErrorBoundary>
      <App />
    </OperationalErrorBoundary>
  </StrictMode>,
);
