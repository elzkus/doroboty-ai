export const operationalErrorEvent = "doroboty:operational-error";

export type OperationalErrorKind = "react-render" | "uncaught-error" | "unhandled-rejection";

export function createOperationalErrorDetail(kind: OperationalErrorKind, occurredAt: string) {
  return { kind, occurredAt } as const;
}

export function reportOperationalError(kind: OperationalErrorKind) {
  window.dispatchEvent(
    new CustomEvent(operationalErrorEvent, {
      detail: createOperationalErrorDetail(kind, new Date().toISOString()),
    }),
  );
}

export function installOperationalErrorCapture() {
  const onError = () => reportOperationalError("uncaught-error");
  const onRejection = () => reportOperationalError("unhandled-rejection");
  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);
  return () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onRejection);
  };
}
