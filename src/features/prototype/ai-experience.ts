import { z } from "zod";

const answer = z.string().trim().max(3000);

export const aiExperienceSchema = z.object({
  source: z.enum(["manual", "portfolio"]),
  portfolioUrl: z.string().trim().max(500),
  roleArea: answer,
  example: answer,
  goal: answer,
  before: answer,
  challenge: answer,
  affected: answer,
  personalContribution: answer,
  teamContribution: answer,
  aiOrigin: z.enum(["", "self", "team", "existing", "unclear"]),
  aiPlace: answer,
  aiTasks: answer,
  tools: answer,
  humanReview: answer,
  keyDecision: answer,
  alternative: answer,
  qualityControl: answer,
  processAttachment: z.string().trim().max(200),
  processAttachmentConsent: z.boolean(),
  outcome: answer,
  reuse: z.enum(["", "once", "several", "regular", "not_used"]),
  evidence: answer,
  reflection: answer,
  resultAttachment: z.string().trim().max(200),
});

export type AiExperience = z.infer<typeof aiExperienceSchema>;

export const emptyAiExperience = (source: AiExperience["source"] = "manual"): AiExperience => ({
  source,
  portfolioUrl: "",
  roleArea: "",
  example: "",
  goal: "",
  before: "",
  challenge: "",
  affected: "",
  personalContribution: "",
  teamContribution: "",
  aiOrigin: "",
  aiPlace: "",
  aiTasks: "",
  tools: "",
  humanReview: "",
  keyDecision: "",
  alternative: "",
  qualityControl: "",
  processAttachment: "",
  processAttachmentConsent: false,
  outcome: "",
  reuse: "",
  evidence: "",
  reflection: "",
  resultAttachment: "",
});

export const requiredAiExperienceFields: (keyof AiExperience)[] = [
  "roleArea",
  "example",
  "goal",
  "before",
  "challenge",
  "affected",
  "personalContribution",
  "teamContribution",
  "aiOrigin",
  "aiPlace",
  "aiTasks",
  "humanReview",
  "keyDecision",
  "qualityControl",
  "outcome",
  "reuse",
  "evidence",
];

const completenessFields: (keyof AiExperience)[] = [
  ...requiredAiExperienceFields,
  "tools",
  "alternative",
  "reflection",
];

export function aiExperienceCompleteness(value: AiExperience) {
  const completed = completenessFields.filter((key) => {
    const field = value[key];
    return typeof field === "string" ? field.trim().length > 0 : Boolean(field);
  }).length;
  return Math.round((completed / completenessFields.length) * 100);
}

export function portfolioDraft(portfolioUrl: string): AiExperience {
  return {
    ...emptyAiExperience("portfolio"),
    portfolioUrl,
    roleArea: "Product management",
    example: "Analiza opinii użytkowników po badaniach produktu",
    goal: "Skrócić analizę odpowiedzi bez utraty kontekstu wypowiedzi.",
    before:
      "Zespół ręcznie porządkował setki odpowiedzi z ankiet i wspólnie przygotowywał nazwy tematów.",
    challenge: "Analiza trwała kilka dni i trudno było zachować spójne kryteria grupowania.",
    personalContribution:
      "Zaprojektowałam proces, wybrałam sposób grupowania danych i przygotowałam kryteria oceny jakości.",
    aiOrigin: "team",
    aiPlace: "Wstępne grupowanie wypowiedzi i proponowanie nazw tematów.",
    aiTasks: "Model proponował grupy, a ja przeglądałam każdą z nich i poprawiałam przypisania.",
    tools:
      "Claude 3.5 Sonnet przez firmowy interfejs oraz arkusz z przygotowanym zestawem odpowiedzi.",
    keyDecision: "Nie automatyzować podsumowań tam, gdzie wypowiedzi były niejednoznaczne.",
    alternative:
      "Rozważaliśmy ręczne kodowanie całego materiału, ale zachowaliśmy je tylko dla próby kontrolnej.",
    outcome: "Pierwsza analiza skróciła się z kilku dni do jednego dnia.",
    reuse: "several",
  };
}

export const aiOriginLabels: Record<Exclude<AiExperience["aiOrigin"], "">, string> = {
  self: "Opracowałam ten sposób samodzielnie",
  team: "Opracowaliśmy go wspólnie w zespole",
  existing: "Korzystałam z istniejącego procesu",
  unclear: "Trudno to jednoznacznie określić",
};

export const reuseLabels: Record<Exclude<AiExperience["reuse"], "">, string> = {
  once: "Jednorazowo",
  several: "W kilku podobnych sytuacjach",
  regular: "Stał się częścią regularnej pracy",
  not_used: "Nie został jeszcze wykorzystany",
};
