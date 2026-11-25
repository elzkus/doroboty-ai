import { describe, expect, it } from "vitest";
import { isPrivateAutocaptureRoute, routeGroup, safeAutocaptureConfig } from "./analytics";

describe("analytics privacy boundaries", () => {
  it("groups dynamic routes without retaining record slugs or query text", () => {
    expect(routeGroup("/oferty/senior-ml-engineer?query=private")).toBe("job_detail");
    expect(routeGroup("/oferty/senior-ml-engineer")).toBe("job_detail");
    expect(routeGroup("/app/kandydaci/application-secret")).toBe("employer_application_detail");
  });

  it("autocaptures only clicks on links and buttons outside sensitive controls", () => {
    expect(safeAutocaptureConfig.dom_event_allowlist).toEqual(["click"]);
    expect(safeAutocaptureConfig.element_allowlist).toEqual(["a", "button"]);
    expect(safeAutocaptureConfig.capture_value_css_selector_allowlist).toEqual([]);
    expect(safeAutocaptureConfig.css_selector_ignorelist).toEqual(
      expect.arrayContaining([
        ".ph-no-autocapture",
        "[data-ph-no-autocapture]",
        "form",
        "input",
        "textarea",
        "select",
        "[contenteditable='true']",
      ]),
    );
  });

  it("excludes authentication, application and workspace routes from autocapture", () => {
    expect(isPrivateAutocaptureRoute("/auth/sign-in")).toBe(true);
    expect(isPrivateAutocaptureRoute("/aplikuj/ai-product-manager")).toBe(true);
    expect(isPrivateAutocaptureRoute("/app")).toBe(true);
    expect(isPrivateAutocaptureRoute("/app/kandydaci/application-secret")).toBe(true);
    expect(isPrivateAutocaptureRoute("/oferty")).toBe(false);
    expect(isPrivateAutocaptureRoute("/oferty/ai-product-manager")).toBe(false);
  });
});
