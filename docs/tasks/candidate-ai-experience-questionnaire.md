# Candidate AI experience questionnaire

## Intent

Extend the existing candidate profile with a structured self-description of practical AI experience, based on the approved prototype screens and specification from the DoRoboty.ai knowledge folder.

## Scope

- Replace the editable-first candidate profile with a readable profile summary and a separate basic-profile editor.
- Add an empty and completed “Doświadczenie w pracy z AI” section below the CV.
- Add two equal method choices directly in the profile, a six-section accordion questionnaire, a simulated portfolio-assisted draft, direct save from the final section and re-edit flows.
- Keep questionnaire answers in the current browser session only. Do not add them to scenario import/export or localStorage.
- Keep the questionnaire a candidate self-description. Do not add verification, competency scoring, recruiter access or real portfolio analysis.

## Acceptance criteria

- A candidate can discover the new section from `/#/app/profil` and understand the purpose, expected time and self-description boundary.
- A candidate can start either method directly from the profile without an additional method-selection step.
- A candidate can complete all six manual sections without answering any question, save directly from the last section, see the answers on the profile and edit them again from the first section.
- Selecting “Dalej” collapses the current accordion section, marks it as reviewed, expands the next section and moves keyboard focus to its header.
- A candidate can open any accordion section directly and use “Wstecz” to return to the previous one.
- A candidate can provide a public portfolio URL and continue through the same six optional accordion sections with a partially completed simulated draft.
- The portfolio URL keeps local format validation; every questionnaire answer remains optional and retains entered content while navigating between sections.
- Optional attachment controls only retain the selected filename and clearly state that upload is simulated.
- The profile displays completeness as information coverage, not skill quality, and labels missing optional information neutrally.
- Desktop and mobile layouts retain Poster People paper, white surfaces, ink contours, Geist Serif headings and pink primary actions.
- Existing CV open/download behavior and basic profile editing remain available.
