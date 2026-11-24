import { describe, expect, it } from "vitest";
import { routeGroup } from "./analytics";

describe("analytics privacy boundaries", () => {
  it("groups dynamic routes without retaining record slugs or query text", () => {
    expect(routeGroup("/oferty/senior-ml-engineer?query=private")).toBe("job_detail");
    expect(routeGroup("/oferty/senior-ml-engineer")).toBe("job_detail");
    expect(routeGroup("/app/kandydaci/application-secret")).toBe("employer_application_detail");
  });
});
