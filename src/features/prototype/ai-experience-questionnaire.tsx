import { useRef, useState, type ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { BriefcaseBusiness, Check, ChevronDown, Clock3, Info, Sparkles } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  aiExperienceCompleteness,
  aiOriginLabels,
  emptyAiExperience,
  portfolioDraft,
  reuseLabels,
  type AiExperience,
} from "./ai-experience";
import { currentPerson } from "./model";
import { usePrototype } from "./store";

type ExperienceKey = keyof AiExperience;
type FlowStage = "manual" | "portfolio-link";
const examplePortfolioUrl = "https://portfolio.example.com/case-study/ai-feedback-analysis";

const manualSteps: { title: string; description: string; required: ExperienceKey[] }[] = [
  {
    title: "Wybierz przykład",
    description: "Zacznij od jednej konkretnej sytuacji, w której AI zmieniło sposób pracy.",
    required: ["roleArea", "example", "goal"],
  },
  {
    title: "Sytuacja przed zmianą",
    description: "Pokaż kontekst, zanim opiszesz rozwiązanie.",
    required: ["before", "challenge", "affected"],
  },
  {
    title: "Twój wkład",
    description: "Oddziel własną odpowiedzialność od pracy innych osób.",
    required: ["personalContribution", "teamContribution", "aiOrigin"],
  },
  {
    title: "Jak wykorzystujesz AI",
    description: "Opisz rolę AI i pracę, która nadal wymagała Twojej oceny.",
    required: ["aiPlace", "aiTasks", "humanReview"],
  },
  {
    title: "Decyzje i kontrola jakości",
    description: "Pokaż sposób myślenia, kompromisy i sprawdzanie wyniku.",
    required: ["keyDecision", "qualityControl"],
  },
  {
    title: "Rezultat i refleksja",
    description: "Opisz zmianę, wykorzystanie rezultatu i dowód wartości.",
    required: ["outcome", "reuse", "evidence"],
  },
];

function QuestionField({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`experience-field${hint ? " experience-field-with-hint" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {hint && (
        <small id={`${id}-hint`} className="experience-field-hint">
          {hint}
        </small>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="experience-field-error" role="alert">
          Uzupełnij to pole, aby przejść dalej.
        </p>
      )}
    </div>
  );
}

function RadioGroup({
  legend,
  name,
  value,
  options,
  error,
  onChange,
}: {
  legend: string;
  name: string;
  value: string;
  options: Record<string, string>;
  error?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset
      className="experience-radio-group"
      aria-describedby={error ? `${name}-error` : undefined}
    >
      <legend>{legend}</legend>
      {Object.entries(options).map(([optionValue, label]) => (
        <label key={optionValue}>
          <input
            type="radio"
            name={name}
            value={optionValue}
            checked={value === optionValue}
            onChange={() => onChange(optionValue)}
          />
          <span>{label}</span>
        </label>
      ))}
      {error && (
        <p id={`${name}-error`} className="experience-field-error" role="alert">
          Wybierz jedną odpowiedź, aby przejść dalej.
        </p>
      )}
    </fieldset>
  );
}

export function AiExperienceProfileSection() {
  const { state, aiExperiences } = usePrototype();
  const person = currentPerson(state)!;
  const experience = aiExperiences[person.id];

  if (!experience)
    return (
      <section className="profile-ai-empty" aria-labelledby="ai-experience-title">
        <header>
          <BriefcaseBusiness aria-hidden="true" />
          <div>
            <h2 id="ai-experience-title">Doświadczenie w pracy z AI</h2>
            <p>
              Pokaż rekruterom, jak wykorzystujesz AI w praktyce — opisz swój wkład, sposób pracy i
              osiągnięty rezultat.
            </p>
          </div>
        </header>
        <div className="profile-ai-methods">
          <article>
            <h3>Uzupełnij krótką ankietę</h3>
            <p>Opowiedz o narzędziach, zadaniach i efektach swojej pracy z AI.</p>
            <span className="profile-ai-time">
              <Clock3 aria-hidden="true" /> Około 10–15 minut
            </span>
            <Link
              className={buttonVariants({ variant: "outline" })}
              to="/app/profil/doswiadczenie-ai?metoda=ankieta"
            >
              Wypełnij ankietę
            </Link>
          </article>
          <article>
            <h3>Pobierz dane z portfolio</h3>
            <p>Dodaj link do case study. AI przygotuje wersję roboczą do Twojej akceptacji.</p>
            <span className="profile-ai-time">
              <Clock3 aria-hidden="true" /> Około 3–5 minut na przegląd
            </span>
            <Link
              className={buttonVariants({ variant: "outline" })}
              to="/app/profil/doswiadczenie-ai?metoda=portfolio"
            >
              Dodaj portfolio
            </Link>
          </article>
        </div>
        <small>Możesz zacząć jedną metodą i później edytować odpowiedzi.</small>
      </section>
    );

  const completeness = aiExperienceCompleteness(experience);
  const sections: { title: string; items: [string, string][] }[] = [
    {
      title: "Przykład doświadczenia",
      items: [
        ["Rola lub obszar pracy", experience.roleArea],
        ["Przykład", experience.example],
        ["Cel", experience.goal],
      ],
    },
    {
      title: "Sytuacja przed zmianą",
      items: [
        ["Wcześniejszy sposób pracy", experience.before],
        ["Trudność", experience.challenge],
        ["Kogo dotyczył problem", experience.affected],
      ],
    },
    {
      title: "Własny wkład",
      items: [
        ["Moja odpowiedzialność", experience.personalContribution],
        ["Wkład innych osób", experience.teamContribution],
        [
          "Pochodzenie sposobu pracy",
          experience.aiOrigin ? aiOriginLabels[experience.aiOrigin] : "",
        ],
      ],
    },
    {
      title: "Wykorzystanie AI",
      items: [
        ["Miejsce AI w procesie", experience.aiPlace],
        ["Praca AI i człowieka", experience.aiTasks],
        ["Narzędzia lub modele", experience.tools],
        ["Praca z wynikiem AI", experience.humanReview],
      ],
    },
    {
      title: "Decyzje i kontrola jakości",
      items: [
        ["Najważniejsza decyzja", experience.keyDecision],
        ["Inne rozważane podejście", experience.alternative],
        ["Kontrola jakości", experience.qualityControl],
        ["Materiał pokazujący sposób pracy", experience.processAttachment],
      ],
    },
    {
      title: "Rezultat i refleksja",
      items: [
        ["Rezultat", experience.outcome],
        ["Sposób wykorzystania", experience.reuse ? reuseLabels[experience.reuse] : ""],
        ["Dowód wartości", experience.evidence],
        ["Co można zrobić inaczej", experience.reflection],
        ["Materiał pokazujący rezultat", experience.resultAttachment],
      ],
    },
  ];
  const missing = [
    ["Jakie inne podejście rozważałaś lub rozważałeś?", experience.alternative],
    ["Co można zrobić inaczej następnym razem?", experience.reflection],
  ].filter(([, value]) => !value.trim());

  return (
    <section className="profile-ai-complete" aria-labelledby="ai-experience-title">
      <header>
        <div>
          <h2 id="ai-experience-title">Doświadczenie w pracy z AI</h2>
          <p>{completeness}% uzupełnienia informacji</p>
        </div>
        <Link
          className={buttonVariants({ variant: "outline", size: "sm" })}
          to="/app/profil/doswiadczenie-ai"
        >
          Edytuj odpowiedzi
        </Link>
      </header>
      <progress value={completeness} max="100" aria-label={`${completeness}% uzupełnienia`} />
      <div className="profile-ai-answers">
        {sections.map((section) => (
          <section key={section.title}>
            <h3>{section.title}</h3>
            <dl>
              {section.items
                .filter(([, value]) => value.trim())
                .map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
            </dl>
          </section>
        ))}
      </div>
      {missing.map(([label]) => (
        <p className="profile-ai-missing" key={label}>
          <Info aria-hidden="true" /> <strong>Do uzupełnienia:</strong> {label}
        </p>
      ))}
      <p className="profile-ai-disclaimer">
        To jest samoopis osoby kandydującej. Informacje nie zostały niezależnie potwierdzone.
      </p>
    </section>
  );
}

export function AiExperienceQuestionnairePage() {
  const { state, aiExperiences, saveAiExperience } = usePrototype();
  const person = currentPerson(state)!;
  const existing = aiExperiences[person.id];
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedSource = searchParams.get("metoda") === "portfolio" ? "portfolio" : "manual";
  const [stage, setStage] = useState<FlowStage>(
    existing ? "manual" : selectedSource === "portfolio" ? "portfolio-link" : "manual",
  );
  const [step, setStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>(
    existing ? manualSteps.map((_, index) => index) : [],
  );
  const [draft, setDraft] = useState<AiExperience>(existing ?? emptyAiExperience(selectedSource));
  const [errors, setErrors] = useState<ExperienceKey[]>([]);
  const [portfolioConsent, setPortfolioConsent] = useState(false);
  const [portfolioRisk, setPortfolioRisk] = useState(false);
  const [urlError, setUrlError] = useState("");

  const sectionButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function update<Key extends ExperienceKey>(key: Key, value: AiExperience[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => current.filter((item) => item !== key));
  }

  function nextStep() {
    setCompletedSteps((current) => (current.includes(step) ? current : [...current, step]));
    if (step === manualSteps.length - 1) {
      save();
      return;
    }
    const next = step + 1;
    setStep(next);
    window.requestAnimationFrame(() => sectionButtonRefs.current[next]?.focus());
  }

  function preparePortfolio() {
    try {
      const url = new URL(draft.portfolioUrl);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
      setUrlError("");
      setDraft(portfolioDraft(url.toString()));
      setCompletedSteps([]);
      setStep(0);
      setStage("manual");
    } catch {
      setUrlError("Podaj pełny publiczny adres zaczynający się od http:// lub https://.");
      window.setTimeout(() => document.getElementById("experience-portfolioUrl")?.focus(), 0);
    }
  }

  function save() {
    if (saveAiExperience(draft)) navigate("/app/profil");
  }

  if (stage === "portfolio-link")
    return (
      <section className="experience-page experience-narrow-page">
        <BackLink to="/app/profil">Wróć do profilu</BackLink>
        <header className="experience-page-header">
          <h1>Dodaj projekt z portfolio</h1>
          <p>Obsługujemy jedną publiczną stronę opisującą jeden projekt.</p>
        </header>
        <div className="experience-form-card">
          <QuestionField
            id="experience-portfolioUrl"
            label="Link do publicznego case study"
            hint="Kliknij pole, aby wstawić przykładowy link i uruchomić ścieżkę demonstracyjną."
          >
            <Input
              id="experience-portfolioUrl"
              type="url"
              value={draft.portfolioUrl}
              aria-invalid={Boolean(urlError) || undefined}
              aria-describedby={`experience-portfolioUrl-hint${urlError ? " portfolio-url-error" : ""}`}
              onChange={(event) => update("portfolioUrl", event.target.value)}
              onFocus={() => {
                if (draft.portfolioUrl.trim()) return;
                update("portfolioUrl", examplePortfolioUrl);
                setPortfolioConsent(true);
                setPortfolioRisk(true);
              }}
            />
            {urlError && (
              <p id="portfolio-url-error" className="experience-field-error" role="alert">
                {urlError}
              </p>
            )}
          </QuestionField>
          <label className="experience-check-row">
            <Checkbox
              checked={portfolioConsent}
              onCheckedChange={(value) => setPortfolioConsent(value === true)}
            />
            <span>
              Pozwalam przeanalizować wskazaną stronę, aby przygotować wersję roboczą odpowiedzi.
            </span>
          </label>
          <label className="experience-check-row">
            <Checkbox
              checked={portfolioRisk}
              onCheckedChange={(value) => setPortfolioRisk(value === true)}
            />
            <span>Rozumiem, że AI może pominąć informacje albo błędnie je zinterpretować.</span>
          </label>
          <div className="experience-actions">
            <Button variant="outline" onClick={() => navigate("/app/profil")}>
              Wstecz
            </Button>
            <Button
              disabled={!portfolioConsent || !portfolioRisk || !draft.portfolioUrl.trim()}
              onClick={preparePortfolio}
            >
              Przygotuj wersję roboczą
            </Button>
          </div>
        </div>
        <p className="experience-simulation-note">
          <Sparkles aria-hidden="true" /> Analiza portfolio jest symulowana na potrzeby testu.
        </p>
      </section>
    );

  if (stage === "manual") {
    return (
      <section className="experience-page experience-narrow-page">
        <BackLink to="/app/profil">Wróć do profilu</BackLink>
        <header className="experience-page-header">
          <h1>Opisz swoje doświadczenie w pracy z AI</h1>
          <p>
            Przejdź przez kolejne sekcje. Wszystkie pytania są opcjonalne, a odpowiedzi możesz
            później edytować.
          </p>
        </header>
        <div className="experience-accordion" aria-label="Sekcje ankiety o doświadczeniu z AI">
          {manualSteps.map((section, index) => {
            const isOpen = step === index;
            const isCompleted = completedSteps.includes(index);
            const headingId = `experience-section-heading-${index}`;
            const panelId = `experience-section-panel-${index}`;

            return (
              <section
                className={`experience-accordion-section${isOpen ? " is-open" : ""}${isCompleted ? " is-completed" : ""}`}
                key={section.title}
              >
                <h2 id={headingId}>
                  <button
                    ref={(element) => {
                      sectionButtonRefs.current[index] = element;
                    }}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setStep(index)}
                  >
                    <span className="experience-accordion-marker" aria-hidden="true">
                      {isCompleted ? <Check /> : index + 1}
                    </span>
                    <span className="experience-accordion-heading">
                      <span>{section.title}</span>
                      <small>{section.description}</small>
                    </span>
                    <ChevronDown className="experience-accordion-chevron" aria-hidden="true" />
                  </button>
                </h2>
                {isOpen && (
                  <div
                    id={panelId}
                    className="experience-accordion-panel"
                    role="region"
                    aria-labelledby={headingId}
                  >
                    <StepFields step={index} draft={draft} errors={errors} update={update} />
                    <div className="experience-actions">
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (index === 0) navigate("/app/profil");
                          else {
                            const previous = index - 1;
                            setStep(previous);
                            window.requestAnimationFrame(() =>
                              sectionButtonRefs.current[previous]?.focus(),
                            );
                          }
                        }}
                      >
                        Wstecz
                      </Button>
                      <Button onClick={nextStep}>
                        {index === manualSteps.length - 1 ? "Zapisz w profilu" : "Dalej"}
                      </Button>
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </section>
    );
  }

  return null;
}

function StepFields({
  step,
  draft,
  errors,
  update,
}: {
  step: number;
  draft: AiExperience;
  errors: ExperienceKey[];
  update: <Key extends ExperienceKey>(key: Key, value: AiExperience[Key]) => void;
}) {
  const hasError = (key: ExperienceKey) => errors.includes(key);
  const area = (key: ExperienceKey, label: string, hint?: string) => (
    <QuestionField id={`experience-${key}`} label={label} hint={hint} error={hasError(key)}>
      <Textarea
        id={`experience-${key}`}
        value={String(draft[key])}
        aria-invalid={hasError(key) || undefined}
        aria-describedby={
          [hint && `experience-${key}-hint`, hasError(key) && `experience-${key}-error`]
            .filter(Boolean)
            .join(" ") || undefined
        }
        onChange={(event) => update(key, event.target.value as never)}
      />
    </QuestionField>
  );

  if (step === 0)
    return (
      <>
        <QuestionField
          id="experience-roleArea"
          label="Jak najlepiej opiszesz swoją rolę lub obszar pracy?"
          error={hasError("roleArea")}
        >
          <select
            id="experience-roleArea"
            className="native-select"
            value={draft.roleArea}
            aria-invalid={hasError("roleArea") || undefined}
            onChange={(event) => update("roleArea", event.target.value)}
          >
            <option value="">Wybierz obszar</option>
            <option>Product management</option>
            <option>Design</option>
            <option>Engineering</option>
            <option>Data i analityka</option>
            <option>Marketing i sprzedaż</option>
            <option>Operacje</option>
            <option>Przywództwo</option>
            <option>Inny obszar</option>
          </select>
        </QuestionField>
        {area(
          "example",
          "Jaki przykład chcesz opisać?",
          "Krótko nazwij projekt, zadanie lub sytuację",
        )}
        {area(
          "goal",
          "Co chciałaś lub chciałeś osiągnąć?",
          "Opisz cel albo problem do rozwiązania",
        )}
        <p className="experience-privacy-note">
          Nie podawaj nazw klientów ani informacji poufnych.
        </p>
      </>
    );
  if (step === 1)
    return (
      <>
        {area("before", "Jak ta praca lub proces wyglądały wcześniej?")}
        {area("challenge", "Co było trudne, czasochłonne albo nieskuteczne?")}
        {area("affected", "Kogo dotyczył ten problem?")}
      </>
    );
  if (step === 2)
    return (
      <>
        {area("personalContribution", "Za co odpowiadałaś lub odpowiadałeś osobiście?")}
        {area("teamContribution", "Co wykonali inni członkowie zespołu?")}
        <RadioGroup
          legend="Jak powstał sposób wykorzystania AI?"
          name="aiOrigin"
          value={draft.aiOrigin}
          options={aiOriginLabels}
          error={hasError("aiOrigin")}
          onChange={(value) => update("aiOrigin", value as AiExperience["aiOrigin"])}
        />
      </>
    );
  if (step === 3)
    return (
      <>
        {area("aiPlace", "W którym miejscu procesu pojawiło się AI?")}
        {area("aiTasks", "Co wykonywało AI, a co nadal wymagało Twojej pracy?")}
        {area("tools", "Jakich narzędzi lub modeli użyto?")}
        {area("humanReview", "Co robiłaś lub robiłeś z wynikiem AI przed jego wykorzystaniem?")}
      </>
    );
  if (step === 4)
    return (
      <>
        {area("keyDecision", "Jaką najważniejszą decyzję podjęłaś lub podjąłeś?")}
        {area("alternative", "Jakie inne podejście było rozważane?")}
        {area("qualityControl", "Jak sprawdzano jakość lub poprawność wyniku AI?")}
        <AttachmentField
          id="processAttachment"
          label="Dodaj materiał pokazujący sposób pracy"
          value={draft.processAttachment}
          update={update}
        />
        {draft.processAttachment && (
          <label className="experience-check-row">
            <Checkbox
              id="experience-processAttachmentConsent"
              checked={draft.processAttachmentConsent}
              aria-invalid={hasError("processAttachmentConsent") || undefined}
              onCheckedChange={(value) => update("processAttachmentConsent", value === true)}
            />
            <span>Mogę udostępnić ten zanonimizowany materiał rekruterom.</span>
          </label>
        )}
        {hasError("processAttachmentConsent") && (
          <p className="experience-field-error" role="alert">
            Potwierdź możliwość udostępnienia wybranego materiału.
          </p>
        )}
      </>
    );
  return (
    <>
      {area("outcome", "Co zmieniło się dzięki temu sposobowi pracy?")}
      <RadioGroup
        legend="Jak wykorzystano rezultat?"
        name="reuse"
        value={draft.reuse}
        options={reuseLabels}
        error={hasError("reuse")}
        onChange={(value) => update("reuse", value as AiExperience["reuse"])}
      />
      {area("evidence", "Skąd wiesz, że rozwiązanie przyniosło wartość?")}
      {area("reflection", "Co można zrobić inaczej dzisiaj?")}
      <AttachmentField
        id="resultAttachment"
        label="Dodaj materiał pokazujący rezultat"
        value={draft.resultAttachment}
        update={update}
      />
    </>
  );
}

function AttachmentField({
  id,
  label,
  value,
  update,
}: {
  id: "processAttachment" | "resultAttachment";
  label: string;
  value: string;
  update: <Key extends ExperienceKey>(key: Key, value: AiExperience[Key]) => void;
}) {
  return (
    <div className="experience-attachment">
      <label htmlFor={`experience-${id}`}>{label}</label>
      <Input
        id={`experience-${id}`}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={(event) => update(id, event.target.files?.[0]?.name ?? "")}
      />
      <small>
        {value
          ? `Wybrano: ${value}. Plik nie zostanie naprawdę przesłany.`
          : "PDF, PNG lub JPG · maks. 10 MB · przesyłanie jest symulowane"}
      </small>
    </div>
  );
}
