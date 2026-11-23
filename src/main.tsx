import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./features/prototype/app";
import { OperationalErrorBoundary } from "./features/prototype/error-boundary";
import { installOperationalErrorCapture } from "./lib/operational-errors";
import "./app/globals.css";

installOperationalErrorCapture();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OperationalErrorBoundary>
      <App />
    </OperationalErrorBoundary>
  </StrictMode>,
);
