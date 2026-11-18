import { describe, expect, it } from "vitest";
import {
  aiExperienceCompleteness,
  aiExperienceSchema,
  emptyAiExperience,
  portfolioDraft,
} from "./ai-experience";

describe("candidate AI experience", () => {
  it("starts empty and reports no completeness", () => {
    expect(aiExperienceCompleteness(emptyAiExperience())).toBe(0);
  });

  it("creates an editable, incomplete portfolio draft", () => {
    const draft = portfolioDraft("https://example.com/case-study");
    expect(aiExperienceSchema.parse(draft).source).toBe("portfolio");
    expect(draft.portfolioUrl).toBe("https://example.com/case-study");
    expect(aiExperienceCompleteness(draft)).toBeGreaterThan(60);
    expect(aiExperienceCompleteness(draft)).toBeLessThan(100);
  });
});
