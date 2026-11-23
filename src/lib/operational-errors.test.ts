import { describe, expect, it } from "vitest";
import { createOperationalErrorDetail } from "./operational-errors";

describe("operational error detail", () => {
  it("contains only a generic class and timestamp", () => {
    const detail = createOperationalErrorDetail("unhandled-rejection", "2026-11-22T14:00:00.000Z");

    expect(detail).toEqual({
      kind: "unhandled-rejection",
      occurredAt: "2026-11-22T14:00:00.000Z",
    });
    expect(Object.keys(detail)).toEqual(["kind", "occurredAt"]);
  });
});
