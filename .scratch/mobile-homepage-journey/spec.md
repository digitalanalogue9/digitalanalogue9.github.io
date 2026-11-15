# Mobile home-page journey

Status: ready-for-agent (prototype phase only)

## Problem statement

On a phone, visitors have to scroll past several sections before reaching the team values action. The current team
action opens exercise setup with Personal values selected, despite the visitor's choice. The owner wants personal and
team entry points near the top while retaining the supporting content, and wants to compare ways of indicating and
navigating further content without making the page feel cluttered.

## Solution

First create an interactive, throwaway mobile prototype comparing ordinary scrolling, a subtle indication of further
content, and a compact way to move between sections. Present the options and wait for the owner to choose one. Then
implement the chosen mobile experience and make the team action preselect Team-focused values. Keep the current desktop
composition and order for the first iteration, apart from correcting that team action.

## User stories

1. As a person visiting on a phone, I want to see how to start a personal values exercise near the top, so I can begin
   without searching the page.
2. As a team facilitator, I want to find the team action near the personal action, so I can choose the appropriate
   exercise.
3. As a visitor deciding whether to start, I want an explanation near each action, so I know what the exercise involves.
4. As a visitor exploring the site, I want the existing decision-scenario and reflection sections retained, so I can
   read why the exercise may be useful.
5. As a mobile visitor, I want to be able to reach and return to the supporting sections, so I can explore at my own
   pace.
6. As a keyboard user, I want a coherent reading and focus order, so I can navigate without relying on touch gestures.
7. As a team facilitator following the team action, I want Team-focused values selected in setup, so the starting choice
   matches my intent.
8. As a visitor in setup, I want to change the selected set before starting, so I can correct my choice.
9. As a personal visitor, I want the personal action and a direct setup visit to default to Personal values, so their
   established behavior remains predictable.
10. As a returning visitor, I want saved-session and resume links to continue to work, so I can return to my exercise.
11. As a visitor, I want a Session created only when I start the exercise, so opening setup alone does not create saved
    work.
12. As a desktop visitor, I want the existing composition retained for the first iteration, so the mobile experiment
    does not unexpectedly redesign my experience.
13. As the owner, I want to compare working alternatives, including no extra navigation, so I can choose whether a
    navigation control earns its space.
14. As the owner, I want copy changes explained and grounded in existing product facts, so the site keeps its voice and
    meaning.

## Implementation decisions

- **Decision gate:** Build and present prototypes first. Wait for the owner's explicit selection before implementing the
  final home-page layout or navigation. Elapsed time is not a selection.
- Compare at least three mobile options: normal scrolling with no additional section navigation; a subtle cue that more
  content follows; and a compact way to move between sections, including back to earlier content. Keep content and
  hierarchy comparable across options. Preserve ordinary scrolling and keyboard accessibility.
- Use the proposed mobile hierarchy as the prototype starting point: H1 “Some things matter more.”; H2 “Which things
  matter to you?”; the personal action, its related links and nearby existing personal explanation; then H2 “What
  matters to your team?”, the team action and existing team explanation. Follow with the decision-scenarios and
  reflection/storage sections. Adjust wording only where justified and explain substantive changes.
- Carry the team action's intent into the existing setup selection and session-creation flow. Preserve the ability to
  switch sets, direct setup behavior and saved-session routing. Select the actual team-focused card set when a team
  Session starts.
- Preserve the site's existing visual identity and typefaces. Keep semantic reading and keyboard order coherent at both
  mobile and desktop widths. If the selected prototype requires a material change to the agreed hierarchy or desktop
  scope, resolve it with the owner first.
- Reduce the top spacing between the mobile home-page content container and its first section, so more of the
  introduction and actions can be seen in the first viewport. Show the tighter spacing in each prototype while
  preserving readable separation from the header and avoiding clipping at narrow widths.
- Preserve the existing uncommitted completed-page clipboard and mobile card-figure changes in the review worktree. Do
  not merge or deploy.

## User-requested skills

- **`copywriting`**: Before drafting prototypes, read product and brand context. Apply it to the personal/team headings,
  action labels and surrounding copy. Preserve voice, meaning and supported claims; explain substantive wording changes
  when presenting options.
- **`impeccable`**: Follow its setup and relevant mobile adaptation guidance for prototype design and, after selection,
  implementation. Use its bounded desktop-and-mobile inspection and confirmation process.
- **`prototype`**: Use its UI branch for the throwaway, interactive comparison. The owner must be able to compare the
  no-navigation option with the alternatives.
- **`react-vite-best-practices`**: Apply relevant React and Vite guidance when implementing the selected homepage and
  setup changes. Preserve existing route splitting and avoid unnecessary dependencies or loading work.
- **`grill-with-docs`**: The owner requested this before implementation. Grilling is complete and its agreed answers are
  recorded here; resume discussion only if a prototype exposes a new unresolved decision.

## Testing decisions

Test observable behavior at the browser journey seam, using the existing home, exercise setup, session and routing
Playwright tests as prior art. Cover both entry points, the initial selection, switching the selection, creation with
team-focused cards, direct setup and saved-session navigation. Check keyboard operation and responsive reading order for
the chosen navigation. Inspect representative mobile and desktop widths in Playwright and run appropriate project
checks. Record actual results and limitations. Prototype code is throwaway and need only be runnable for comparison;
test the production behavior after a choice.

## Out of scope

- Selecting a final navigation treatment before the owner has seen the prototypes.
- A wholesale desktop redesign, factual repositioning, new product claims, or changing the site's font families.
- A shared online workspace or combining individual results: the glossary defines a Team values exercise as a
  facilitated group conversation using team-focused cards.
- Merging to main, deploying or publishing.

## Further notes and context

Work in `C:\dev\github\digitalanalogue9-ui-review` on `review/desktop-mobile-quality`; inspect Git status first. At
handoff the worktree has uncommitted completed-page clipboard and mobile card-figure changes. Preserve them.

Read `PRODUCT.md`, `DESIGN.md`, `GLOSSARY.md`, `CODING_STANDARDS.md` and the local issue-tracker conventions.
`src/app/HomeClient.tsx` composes the home sections and `src/styles/editorial.css` defines their responsive layout. The
card figure is `.editorial-card-composition`; `.editorial-hero-copy` contains the heading and links.
`src/app/exercise-flow/ExerciseSetup.tsx` initializes the exercise type and creates the Session on submit;
`src/app/ExerciseRoute.tsx` distinguishes setup from saved sessions using `sessionId`.

The navigation treatment is the outstanding product decision. The owner has not approved a production implementation of
any prototype variant.

## Owner decision (2026-11-15)

Selected option 1: ordinary scrolling. On mobile, aim to show the personal and team sections in the first iPhone SE
viewport. Blend the See how it works and Resume an exercise links into the personal explanation; omit ‘in History’.
Remove the gap and divider between the personal and team sections. Prototype reference: branch
`prototype/mobile-homepage-journey`, commit `e3ecd1d`.
