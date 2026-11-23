# DoRoboty.ai Navy Signal

Navy Signal is the required visual system for all current and future prototype screens.
The previous Poster People kit remains in this directory only as historical implementation
evidence and is not a visual authority.

## Core roles

- Navy `#06152D`: brand frame, public app bar, hero and short technical modules.
- Blue `#2D66F5`: primary actions, links, focus and active controls.
- Yellow `#F7BD37`: scarce quality or recommendation signal and active navigation underline.
- Canvas `#F4F7FC`: product background.
- Surface `#FFFFFF`: cards, forms and reading surfaces.
- Ink `#0B1C36`, muted `#60708A`, line `#DBE3F0`.

## Typography and geometry

- Use one sans-serif family throughout. Serif headings are not allowed.
- Product H1: 40–52px; public campaign hero: up to 82px; H2: 28–36px; body: 16px with 1.5–1.7 line height.
- Controls have at least 44px height, 8–10px radius and 16px horizontal padding.
- Cards use 24px padding, 12–16px radius and a 1px cool line.
- Significant icons use an explicit 20×20px canvas inside at least 44×44px controls.
- Content max-width is 1280px; reading width is 720px.

## Component contract

- Primary buttons are blue with white text. Secondary buttons are white with a cool border.
- Navy is a brand frame, not the default background for long reading or forms.
- Yellow stays below roughly 15% of a view and communicates a useful signal, not decoration.
- Checkbox and radio controls precede their labels and share a minimum 44px clickable row.
- Inputs always have visible labels; placeholders never replace labels.
- Modal focus is trapped and returns to the trigger.

## Screen patterns

- Public home and listing use a navy app bar and hero, then a light-first content canvas.
- Listing filters form a quiet white side panel; results use compact white job rows.
- Offer details keep a readable white article and an optional sticky action panel.
- Candidate and employer workspaces use a navy sidebar with blue active navigation.
- Profile and forms use white surfaces, cool borders and information-first hierarchy.

## Verification

Check desktop, 390px mobile, keyboard focus, long titles, missing salary, disabled/error states,
and 200% zoom. Confirm that the interface reads as an AI jobs product rather than fintech.
